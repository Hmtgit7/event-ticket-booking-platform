import { NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth-cookie-names";
import { decodeJwt, isTokenExpired } from "@/lib/jwt";
import { resolvePostLoginRedirect } from "@/modules/auth/utils/post-login-redirect";
import { Role } from "@/enums/role.enum";

/**
 * UX-level route gating only - avoids a flash of protected content before
 * redirecting. The REAL authorization boundary is the backend re-verifying
 * the JWT signature on every request; this middleware never verifies
 * anything, it only decodes (see lib/jwt.ts).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    // Already-logged-in admin landing on their own login page (e.g. a second
    // tab, or "Start free" from the marketing site while a session is live) -
    // send them straight to the dashboard instead of showing login again.
    return redirectIfAuthenticated(request);
  }

  if (pathname.startsWith("/admin")) {
    return guard(request, [Role.Admin], "/admin/login");
  }

  if (pathname === "/auth/login" || pathname === "/auth/signup") {
    return redirectIfAuthenticated(request);
  }

  if (pathname.startsWith("/dashboard")) {
    return guard(request, [Role.Organizer, Role.Admin], "/auth/login");
  }

  if (pathname.startsWith("/user")) {
    return guard(request, [Role.User, Role.Organizer, Role.Admin], "/auth/login");
  }

  return NextResponse.next();
}

function guard(request: NextRequest, allowedRoles: Role[], loginPath: string) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const hasRefreshToken = Boolean(request.cookies.get(REFRESH_TOKEN_COOKIE)?.value);
  const claims = accessToken ? decodeJwt(accessToken) : null;

  // Access token missing/expired but a refresh token exists: let the request
  // through optimistically. The API client silently refreshes on the next
  // fetch (see lib/refresh-token.ts) - bouncing to login here would log out
  // an otherwise-valid session every 15 minutes (the access token TTL).
  if ((!claims || isTokenExpired(claims)) && hasRefreshToken) {
    return NextResponse.next();
  }

  const isAuthorized = claims && !isTokenExpired(claims) && claims.roles.some((role) => allowedRoles.includes(role));

  if (!isAuthorized) {
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/**
 * Used on /auth/login, /auth/signup, /admin/login - pages that only make sense
 * for someone who ISN'T logged in yet. Covers both the "second browser tab"
 * and "Start free from the marketing site while already logged in" cases.
 */
function redirectIfAuthenticated(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const hasRefreshToken = Boolean(request.cookies.get(REFRESH_TOKEN_COOKIE)?.value);
  const claims = accessToken ? decodeJwt(accessToken) : null;

  if (claims) {
    // decodeJwt doesn't check expiry - even a stale-but-decodable access token
    // tells us who they are. The API client refreshes transparently on the
    // next authenticated request, so redirecting now (rather than waiting for
    // that refresh) is safe and avoids a pointless bounce back through login.
    return NextResponse.redirect(new URL(resolvePostLoginRedirect(claims.roles), request.url));
  }

  if (hasRefreshToken) {
    // No access token cookie at all, but a refresh token exists - we can't
    // read roles from nothing, so don't guess a destination. Let the login/
    // signup page render; client-side hydrate() will pick up the session on
    // its own right after.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/user/:path*", "/auth/login", "/auth/signup"],
};
