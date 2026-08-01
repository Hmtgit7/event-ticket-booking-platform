"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar/topbar";
import { MOCK_EVENTS } from "@/constants/mock-events";
import { NavRoute } from "@/enums/nav-route.enum";

interface DashboardShellProps {
  children: React.ReactNode;
}

const STATIC_CRUMBS: Record<string, { section: string; crumb: string }> = {
  [NavRoute.Dashboard]: { section: "Dashboard", crumb: "Dashboard" },
  [NavRoute.Events]: { section: "Dashboard/ Event", crumb: "Event" },
  [NavRoute.AttendeeInsights]: { section: "Dashboard/ Insights", crumb: "Attendee Insights" },
  [NavRoute.Settings]: { section: "Dashboard/ Settings", crumb: "Settings" },
  [NavRoute.Help]: { section: "Dashboard/ Help", crumb: "Help & Support" },
};

/** Derives the topbar's "section / crumb" text from the current route so
 * every page can stay a plain content component instead of repeating
 * header markup. Looks up the event title for /dashboard/events/[id]
 * routes so the breadcrumb reads "Event / Food Exhibition" like the
 * reference design. */
function useBreadcrumb(): { section: string; crumb: string } {
  const pathname = usePathname() ?? NavRoute.Dashboard;

  return useMemo(() => {
    const staticCrumb = STATIC_CRUMBS[pathname];
    if (staticCrumb) return staticCrumb;

    const segments = pathname.split("/").filter(Boolean);
    const eventId = segments[2];
    const event = MOCK_EVENTS.find((item) => item.id === eventId);
    const isInsights = segments[3] === "insights";

    if (event && isInsights) {
      return { section: `Dashboard/ Event/ ${event.title}`, crumb: "Attendee Insights" };
    }
    if (event) {
      return { section: `Dashboard/ Event/ ${event.title}`, crumb: event.title };
    }

    return { section: "Dashboard", crumb: "Dashboard" };
  }, [pathname]);
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { section, crumb } = useBreadcrumb();

  return (
    <div className="flex min-h-screen gap-4 bg-background p-4">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <DashboardTopbar section={section} crumb={crumb} />
        <main className="flex-1 pb-4">{children}</main>
      </div>
    </div>
  );
}

