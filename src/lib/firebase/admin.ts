/**
 * Firebase for the SERVER.
 * This bypasses every security rule, so it must never be imported by a
 * file that runs in the browser. Server components, server actions and
 * route handlers only.
 *
 * Everything is created lazily, the first time it is actually used.
 * That way the project still builds and the public pages still render
 * their error states if the credentials are missing.
 */
import "server-only";
import { initializeApp, getApps, getApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

let cached: App | null = null;

export function adminApp(): App {
  if (cached) return cached;
  if (getApps().length) {
    cached = getApp();
    return cached;
  }

  /**
   * Credentials are read from ADMIN_* first, then FIREBASE_*.
   *
   * Why two names: Firebase App Hosting reserves the FIREBASE_ prefix
   * for its own variables and refuses to set one. So deployments use
   * ADMIN_CLIENT_EMAIL and ADMIN_PRIVATE_KEY, while .env.local on your
   * machine can keep the original names. Either works.
   */
  const projectId =
    process.env.ADMIN_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  const clientEmail = process.env.ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;

  // The key is stored with literal \n characters, so they have to be
  // turned back into real line breaks.
  const privateKey = (process.env.ADMIN_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY)?.replace(
    /\\n/g,
    "\n"
  );

  const storageBucket =
    process.env.ADMIN_STORAGE_BUCKET ||
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  if (clientEmail && privateKey && projectId) {
    cached = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      storageBucket,
    });
    return cached;
  }

  /**
   * No key in the environment. On Google infrastructure — which is
   * where App Hosting runs — the server already has an identity, and
   * Firebase picks it up automatically. This is the safer path in
   * production: there is no key file to leak because there is no key.
   */
  if (projectId) {
    cached = initializeApp({ projectId, storageBucket });
    return cached;
  }

  throw new Error(
    "Firebase Admin is not configured. Set ADMIN_CLIENT_EMAIL and ADMIN_PRIVATE_KEY (or the FIREBASE_ equivalents) in .env.local"
  );
}

export const adminDb = (): Firestore => getFirestore(adminApp());
export const adminAuth = (): Auth => getAuth(adminApp());
export const adminBucket = () => getStorage(adminApp()).bucket();