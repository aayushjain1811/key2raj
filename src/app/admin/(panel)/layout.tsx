import { requireAdmin } from "@/lib/auth/session";

/**
 * This is the real gate. The middleware only checked that a cookie
 * exists; here the cookie is verified against Firebase and the user's
 * role is looked up. Anyone who fails is sent to the login page.
 */
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}
