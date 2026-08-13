"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { DashboardTopbar } from "@/components/dashboard/topbar/topbar";
import { AdminDashboardSidebar } from "@/components/admin-dashboard/sidebar/admin-sidebar";
import { NavRoute } from "@/enums/nav-route.enum";

interface AdminDashboardShellProps {
  children: React.ReactNode;
}

const ADMIN_CRUMBS: Record<string, { section: string; crumb: string }> = {
  [NavRoute.AdminDashboard]: { section: "Admin",          crumb: "Overview"       },
  [NavRoute.AdminUsers]:     { section: "Admin / Manage", crumb: "Users"          },
  [NavRoute.AdminEvents]:    { section: "Admin / Manage", crumb: "Events"         },
  [NavRoute.AdminBookings]:  { section: "Admin / Manage", crumb: "Bookings"       },
  [NavRoute.AdminReports]:   { section: "Admin / Manage", crumb: "Reports"        },
  [NavRoute.AdminSupport]:   { section: "Admin / Manage", crumb: "Support Tickets"},
  [NavRoute.AdminNotifications]: { section: "Admin / Manage", crumb: "Notifications" },
  [NavRoute.AdminSettings]:  { section: "Admin / System", crumb: "Settings"       },
};

function useBreadcrumb(): { section: string; crumb: string } {
  const pathname = usePathname() ?? NavRoute.AdminDashboard;
  return useMemo(
    () => ADMIN_CRUMBS[pathname] ?? { section: "Admin", crumb: "Dashboard" },
    [pathname],
  );
}

/**
 * Layout shell for all /admin/dashboard/* routes.
 * Reuses DashboardTopbar and the shared sidebar nav-item primitive —
 * only the sidebar and nav sections are admin-specific.
 */
export function AdminDashboardShell({ children }: AdminDashboardShellProps) {
  const { section, crumb } = useBreadcrumb();

  return (
    <div className="flex h-screen gap-4 bg-background p-4 overflow-hidden">
      <AdminDashboardSidebar />
      {/* right column: topbar fixed at top, main scrolls beneath it */}
      <div className="main-scroll flex min-w-0 flex-1 flex-col overflow-y-auto">
        <DashboardTopbar section={section} crumb={crumb} />
        <main className="flex-1 mt-4 pb-4">{children}</main>
      </div>
    </div>
  );
}
