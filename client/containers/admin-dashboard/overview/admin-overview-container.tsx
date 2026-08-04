"use client";

import Link from "next/link";
import { AdminStatCard } from "@/components/admin-dashboard/widgets/admin-stat-card";
import { AdminSectionTitle } from "@/components/admin-dashboard/widgets/admin-section-title";
import { StatusBadge } from "@/components/admin-dashboard/widgets/status-badge";
import { BarChart } from "@/components/charts/bar-chart";
import {
  ADMIN_PLATFORM_STATS,
  ADMIN_REVENUE_CHART,
  ADMIN_EVENTS,
  ADMIN_SUPPORT,
} from "@/constants/admin-dashboard-data";
import { NavRoute } from "@/enums/nav-route.enum";

const EVENT_STATUS_VARIANT = {
  Live:    "green",
  Draft:   "muted",
  Flagged: "red",
  Ended:   "muted",
} as const;

/** Admin overview — platform stats, revenue chart, recent events, open tickets. */
export function AdminOverviewContainer() {
  const recentEvents  = ADMIN_EVENTS.slice(0, 5);
  const openTickets   = ADMIN_SUPPORT.filter((t) => t.status !== "Resolved").slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      {/* ── Stat grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ADMIN_PLATFORM_STATS.map((stat) => (
          <AdminStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* ── Revenue chart ── */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <AdminSectionTitle eyebrow="Finance" title="Monthly Revenue" />
          <Link href={NavRoute.AdminReports} className="text-sm font-medium text-ink-muted hover:text-ink">
            Full report →
          </Link>
        </div>
        <BarChart points={ADMIN_REVENUE_CHART} variant="capsule-line" accentIndex={9} height={200} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {/* ── Recent events ── */}
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <AdminSectionTitle eyebrow="Events" title="Recent Events" />
            <Link href={NavRoute.AdminEvents} className="text-sm font-medium text-ink-muted hover:text-ink">View all →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-background px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{event.title}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{event.organizer} · {event.date}</p>
                </div>
                <StatusBadge label={event.status} variant={EVENT_STATUS_VARIANT[event.status]} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Open support ── */}
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <AdminSectionTitle eyebrow="Support" title="Open Tickets" />
            <Link href={NavRoute.AdminSupport} className="text-sm font-medium text-ink-muted hover:text-ink">View all →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {openTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-background px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{ticket.subject}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{ticket.user} · {ticket.created}</p>
                </div>
                <StatusBadge
                  label={ticket.priority}
                  variant={ticket.priority === "High" ? "red" : ticket.priority === "Medium" ? "yellow" : "muted"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
