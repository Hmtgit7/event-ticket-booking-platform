import { NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth-cookie-names";
import { decodeJwt, isTokenExpired } from "@/lib/jwt";
import { Role } from "@/enums/role.enum";

/**
 * UX-level route gating only - avoids a flash of protected content before
 * redirecting. The REAL authorization boundary is the backend re-verifying
 * the JWT signature on every request; this middleware never verifies
 * anything, it only decodes (see lib/jwt.ts).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    return guard(request, [Role.Admin], "/admin/login");
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

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/user/:path*"],
};
