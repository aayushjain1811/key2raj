/**
 * A first gate in front of /admin. It only checks that a session cookie
 * exists, because middleware runs on the Edge runtime where the Firebase
 * Admin SDK cannot run. The real verification happens in the admin
 * layout on the server. Two layers, both needed.
 */
import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "k2r_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/admin/login") {
    if (hasSession) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!hasSession) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
