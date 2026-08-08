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
    return guard(request, [Role.Admin], "/admin/login", { requireVerifiedEmail: false });
  }

  if (pathname === "/auth/login" || pathname === "/auth/signup") {
    return redirectIfAuthenticated(request);
  }

  if (pathname === "/auth/verify-email") {
    return guardVerifyEmailPage(request);
  }

  if (pathname === "/auth/forgot-password") {
    // No longer a real page - folded into the login screen as a client-side
    // view-toggle (see AuthForm/ForgotPasswordForm), matching how Workday's
    // "forgot password" only exists as a state inside login, never a pastable
    // URL. Unconditional redirect, regardless of auth/token state - there is no
    // legitimate direct entry point to this path anymore.
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (pathname === "/auth/reset-password") {
    return guardResetPasswordPage(request);
  }

  if (pathname.startsWith("/dashboard")) {
    return guard(request, [Role.Organizer, Role.Admin], "/auth/login");
  }

  if (pathname.startsWith("/user")) {
    return guard(request, [Role.User, Role.Organizer, Role.Admin], "/auth/login");
  }

  return NextResponse.next();
}

function guard(
  request: NextRequest,
  allowedRoles: Role[],
  loginPath: string,
  options: { requireVerifiedEmail?: boolean } = {},
) {
  const { requireVerifiedEmail = true } = options;
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
    // Param name must match what use-login.ts reads (`?redirect=`) - this was
    // previously "redirectTo", a silent mismatch that meant a wrong-role/
    // logged-out visitor bounced through login never actually returned to the
    // page they were trying to reach, landing on their role's default
    // dashboard instead. RequireAuth's client-side redirect already used the
    // correct "redirect" name; this brings the two in line.
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated and role-authorized, but hasn't clicked the verification
  // link yet - a signed-in-but-unverified account still gets a real JWT with
  // real role claims (see AuthService.signup), so role checks alone let them
  // straight into the dashboard from a second tab. Send them back to login
  // (not /auth/verify-email - that route no longer has a token-less "check
  // your inbox" state; see guardVerifyEmailPage) where the login flow's
  // dedicated "please verify your account" screen takes over.
  if (requireVerifiedEmail && claims && !claims.emailVerified) {
    return NextResponse.redirect(new URL(loginPath, request.url));
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

  // Only redirect away for a VERIFIED session. An authenticated-but-unverified
  // session (e.g. right after signup, before clicking the email link) must
  // still be able to render /auth/login normally - otherwise it gets bounced
  // to the dashboard, which then bounces it back out for being unverified,
  // which lands back here... a loop. Letting login render lets the user
  // either finish signing in fresh, or - since AuthForm's login mutation
  // surfaces the dedicated "please verify your account" screen for exactly
  // this case - resend their verification link on demand.
  if (claims?.emailVerified) {
    // decodeJwt doesn't check expiry - even a stale-but-decodable access token
    // tells us who they are. The API client refreshes transparently on the
    // next authenticated request, so redirecting now (rather than waiting for
    // that refresh) is safe and avoids a pointless bounce back through login.
    return NextResponse.redirect(new URL(resolvePostLoginRedirect(claims.roles), request.url));
  }

  if (hasRefreshToken && !accessToken) {
    // No access token cookie at all, but a refresh token exists - we can't
    // read roles (or emailVerified) from nothing, so don't guess a
    // destination. Let the login/signup page render; client-side hydrate()
    // picks up the session right after.
    return NextResponse.next();
  }

  return NextResponse.next();
}

/**
 * Guards /auth/verify-email itself - now token-only. "Check your inbox" lives
 * as an in-page state on the signup form (see SignupForm/AwaitingVerification),
 * not here, precisely so a lingering authenticated-but-unverified session
 * cookie can't keep resurrecting this page on every later visit, refresh, or
 * browser reopen. This route's only remaining job is completing verification
 * for a real emailed link - the two failure modes closed here:
 *
 * 1. An expired-but-decodable access token showing emailVerified=true was
 *    being treated as "unknown", so a click on an old/already-used link
 *    rendered a scary "this link didn't work" error instead of just going to
 *    the dashboard. Fixed by trusting `emailVerified` off the token
 *    regardless of expiry - it only ever flips false -> true, never back, so
 *    staleness doesn't matter for this one field.
 * 2. This route had NO auth requirement at all - anyone, logged in or not,
 *    could type the URL directly and see an internal auth-flow page. Fixed:
 *    no `token` in the URL means there's nothing for this page to do, so it
 *    always redirects to login, regardless of session state.
 *
 * A `token` in the URL remains a legitimate entry point regardless of
 * session state, since clicking the emailed link on a different
 * device/browser than the one that signed up is a real, valid flow - the
 * backend does the real validation on that token either way.
 */
function guardVerifyEmailPage(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const claims = accessToken ? decodeJwt(accessToken) : null;
  const hasToken = Boolean(request.nextUrl.searchParams.get("token"));

  if (claims?.emailVerified) {
    return NextResponse.redirect(new URL(resolvePostLoginRedirect(claims.roles), request.url));
  }

  if (hasToken) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/auth/login", request.url));
}

/**
 * Guards /auth/reset-password - unlike forgot-password, this route stays real
 * and public because it's the actual link clicked from the reset email, which
 * must work from any device/browser/session state, same as verify-email. A
 * visit with no `token` at all isn't a legitimate reset attempt, so send it
 * somewhere useful instead of rendering an empty/broken form: back to
 * dashboard if already logged in, otherwise to login (where "Forgot
 * Password?" starts a fresh request).
 */
function guardResetPasswordPage(request: NextRequest) {
  if (request.nextUrl.searchParams.get("token")) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const claims = accessToken ? decodeJwt(accessToken) : null;

  if (claims) {
    return NextResponse.redirect(new URL(resolvePostLoginRedirect(claims.roles), request.url));
  }

  return NextResponse.redirect(new URL("/auth/login", request.url));
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/user/:path*",
    "/auth/login",
    "/auth/signup",
    "/auth/verify-email",
    "/auth/forgot-password",
    "/auth/reset-password",
  ],
};
