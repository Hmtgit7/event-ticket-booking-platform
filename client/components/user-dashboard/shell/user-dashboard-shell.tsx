"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { DashboardTopbar } from "@/components/dashboard/topbar/topbar";
import { UserDashboardSidebar } from "@/components/user-dashboard/sidebar/user-sidebar";
import { NavRoute } from "@/enums/nav-route.enum";

interface UserDashboardShellProps {
  children: React.ReactNode;
}

/** Breadcrumb map for all user dashboard routes. */
const USER_CRUMBS: Record<string, { section: string; crumb: string }> = {
  [NavRoute.UserDashboard]: { section: "My Account", crumb: "Overview" },
  [NavRoute.UserExplore]:   { section: "My Account / Discover", crumb: "Explore Events" },
  [NavRoute.UserOrders]:    { section: "My Account / Tickets", crumb: "Order History" },
  [NavRoute.UserSaved]:     { section: "My Account / Tickets", crumb: "Saved Events" },
  [NavRoute.UserWallet]:    { section: "My Account / Payments", crumb: "Wallet" },
  [NavRoute.UserProfile]:   { section: "My Account / Settings", crumb: "Profile" },
  [NavRoute.UserSupport]:   { section: "My Account / Help", crumb: "Help & Support" },
};

function useBreadcrumb(): { section: string; crumb: string } {
  const pathname = usePathname() ?? NavRoute.UserDashboard;

  return useMemo(() => {
    const hit = USER_CRUMBS[pathname];
    if (hit) return hit;

    // Fallback for any deeply nested user route
    return { section: "My Account", crumb: "Dashboard" };
  }, [pathname]);
}

/**
 * Layout shell for the user-facing dashboard. Shares the same topbar and
 * nav-item primitives as the organizer dashboard; only the nav sections
 * differ. Using the shared DashboardTopbar keeps the UI consistent.
 */
export function UserDashboardShell({ children }: UserDashboardShellProps) {
  const { section, crumb } = useBreadcrumb();

  return (
    <div className="flex min-h-screen gap-4 bg-background p-4">
      <UserDashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <DashboardTopbar section={section} crumb={crumb} />
        <main className="flex-1 pb-4">{children}</main>
      </div>
    </div>
  );
}
