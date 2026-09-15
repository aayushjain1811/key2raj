/**
 * =====================================================================
 * ADMIN SESSION + AUTHORIZATION
 * ---------------------------------------------------------------------
 * How login works, in order:
 *   1. The browser signs in with Firebase and gets an ID token.
 *   2. It posts that token to /api/auth/session.
 *   3. The server verifies it, checks the user is an admin, and sets a
 *      httpOnly cookie the browser cannot read.
 *   4. Every admin page verifies that cookie on the server.
 *
 * Being signed in is NOT the same as being an admin. The role comes
 * from the users collection, so you can add SUPER_ADMIN or AGENT later
 * without touching this logic.
 * =====================================================================
 */
import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export const SESSION_COOKIE = "k2r_session";
const FIVE_DAYS_MS = 60 * 60 * 24 * 5 * 1000;

export type Role = "SUPER_ADMIN" | "ADMIN" | "AGENT";

export interface AdminUser {
  uid: string;
  email: string;
  name: string;
  role: Role;
}

/** Roles allowed into the admin panel. Widen this as you add roles. */
const ALLOWED_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN"];

/** Looks the user up in the users collection and returns their role. */
async function roleFor(uid: string): Promise<Role | null> {
  const doc = await adminDb().collection("users").doc(uid).get();
  if (!doc.exists) return null;
  const role = doc.data()?.role as Role | undefined;
  return role && ALLOWED_ROLES.includes(role) ? role : null;
}

/** Swaps a freshly minted ID token for a long-lived session cookie. */
export async function createSessionCookie(idToken: string): Promise<string> {
  return adminAuth().createSessionCookie(idToken, { expiresIn: FIVE_DAYS_MS });
}

export async function setSessionCookie(value: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, value, {
    maxAge: FIVE_DAYS_MS / 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Verifies the token and confirms the account is an admin. */
export async function verifyIdTokenAsAdmin(idToken: string): Promise<AdminUser | null> {
  try {
    const decoded = await adminAuth().verifyIdToken(idToken, true);
    const role = await roleFor(decoded.uid);
    if (!role) return null;
    return {
      uid: decoded.uid,
      email: decoded.email ?? "",
      name: decoded.name ?? decoded.email ?? "Administrator",
      role,
    };
  } catch {
    return null;
  }
}

/** Reads the cookie and returns the admin, or null. Never throws. */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const store = await cookies();
  const session = store.get(SESSION_COOKIE)?.value;
  if (!session) return null;
  try {
    const decoded = await adminAuth().verifySessionCookie(session, true);
    const role = await roleFor(decoded.uid);
    if (!role) return null;
    return {
      uid: decoded.uid,
      email: decoded.email ?? "",
      name: decoded.name ?? decoded.email ?? "Administrator",
      role,
    };
  } catch {
    return null;
  }
}

/** Use at the top of every admin page and server action. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
