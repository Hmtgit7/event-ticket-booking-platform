"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Role } from "@/enums/role.enum";
import { useAuthStore } from "@/store/auth-store";
import { resolvePostLoginRedirect } from "@/modules/auth/utils/post-login-redirect";

interface RequireAuthProps {
  children: React.ReactNode;
  /**
   * If provided, the signed-in user must hold at least one of these roles.
   * A logged-out visitor is sent to login; a logged-in-but-wrong-role user
   * is sent to their own dashboard instead (they're authenticated, just
   * not authorized for this section).
   */
  anyOfRoles?: Role[];
}

/**
 * Client-side route guard for dashboard layouts. Waits for the auth store
 * to hydrate (checks the access-token cookie) before deciding - redirecting
 * before hydration would bounce a genuinely logged-in user on every refresh.
 */
export function RequireAuth({ children, anyOfRoles }: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const hasRequiredRole = !anyOfRoles || (user ? anyOfRoles.some((role) => user.roles.includes(role)) : false);

  useEffect(() => {
    if (!isHydrated) return;

    if (!user) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname ?? "/")}`);
      return;
    }
    if (!hasRequiredRole) {
      router.replace(resolvePostLoginRedirect(user.roles));
    }
  }, [isHydrated, user, hasRequiredRole, pathname, router]);

  if (!isHydrated || !user || !hasRequiredRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-ink-muted">
        Checking your session…
      </div>
    );
  }

  return <>{children}</>;
}
