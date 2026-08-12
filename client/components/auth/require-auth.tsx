"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Role } from "@/enums/role.enum";
import { useAuthStore } from "@/store/auth-store";
import { resolvePostLoginRedirect } from "@/modules/auth/utils/post-login-redirect";
import { FullPageLoader } from "@/components/common/full-page-loader";

interface RequireAuthProps {
  children: React.ReactNode;
  /**
   * If provided, the signed-in user must hold at least one of these roles.
   * A logged-out visitor is sent to login; a logged-in-but-wrong-role user
   * is sent to their own dashboard instead (they're authenticated, just
   * not authorized for this section).
   */
  anyOfRoles?: Role[];
  /**
   * Set false for sections that don't gate on email verification (e.g. the
   * admin dashboard - admin accounts are created via bootstrap/invite, not
   * the public signup+verify-email flow). Mirrors proxy.ts's own
   * `requireVerifiedEmail` exemption for /admin. Defaults to true.
   */
  requireVerifiedEmail?: boolean;
}

/**
 * Client-side route guard for dashboard layouts. Waits for the auth store
 * to hydrate (checks the access-token cookie) before deciding - redirecting
 * before hydration would bounce a genuinely logged-in user on every refresh.
 */
export function RequireAuth({ children, anyOfRoles, requireVerifiedEmail = true }: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const hasRequiredRole = !anyOfRoles || (user ? anyOfRoles.some((role) => user.roles.includes(role)) : false);
  // A signed-up-but-unverified account still gets a real session (see
  // AuthService.signup issuing tokens immediately) - middleware already
  // blocks a fresh page load, but this covers client-side/SPA navigations
  // within an already-hydrated tab so the dashboard never renders for them.
  const isEmailVerified = !requireVerifiedEmail || (user ? user.emailVerified : false);

  useEffect(() => {
    if (!isHydrated) return;

    if (!user) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname ?? "/")}`);
      return;
    }
    if (!isEmailVerified) {
      // Not /auth/verify-email - that route is token-only now (see
      // proxy.ts's guardVerifyEmailPage). "Check your inbox" only ever shows
      // as an in-page state right after signup; anywhere else, an unverified
      // session goes back to login, where AuthForm's dedicated "please verify
      // your account" screen (with its own resend button) takes over.
      router.replace("/auth/login");
      return;
    }
    if (!hasRequiredRole) {
      router.replace(resolvePostLoginRedirect(user.roles));
    }
  }, [isHydrated, user, isEmailVerified, hasRequiredRole, pathname, router]);

  if (!isHydrated || !user || !isEmailVerified || !hasRequiredRole) {
    return <FullPageLoader message="Setting up the app for you…" />;
  }

  return <>{children}</>;
}
