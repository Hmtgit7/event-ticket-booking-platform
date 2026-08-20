"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminStatCard } from "@/components/admin-dashboard/widgets/admin-stat-card";
import { AdminSectionTitle } from "@/components/admin-dashboard/widgets/admin-section-title";
import { StatusBadge } from "@/components/admin-dashboard/widgets/status-badge";
import { BarChart } from "@/components/charts/bar-chart";
import {
  ADMIN_PLATFORM_STATS,
  ADMIN_REVENUE_CHART,
  ADMIN_EVENTS,
} from "@/constants/admin-dashboard-data";
import { NavRoute } from "@/enums/nav-route.enum";
import { adminSupportTicketService } from "@/services/admin-support.service";
import type { SupportTicketResponse } from "@/interfaces/admin-support-api.interface";

const EVENT_STATUS_VARIANT = {
  Live:    "green",
  Draft:   "muted",
  Flagged: "red",
  Ended:   "muted",
} as const;

const TICKET_CATEGORY_LABELS: Record<string, string> = {
  REFUND: "Refund",
  TECHNICAL: "Technical",
  EVENT_ISSUE: "Event issue",
  PAYMENT: "Payment",
  OTHER: "Other",
};

/** Admin overview — platform stats, revenue chart, recent events, open tickets. */
export function AdminOverviewContainer() {
  const recentEvents = ADMIN_EVENTS.slice(0, 5);
  const [openTickets, setOpenTickets] = useState<SupportTicketResponse[] | null>(null);

  useEffect(() => {
    adminSupportTicketService.getAllTickets("All", 0, 20).then((res) => {
      setOpenTickets(res.items.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").slice(0, 4));
    });
  }, []);

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
            {openTickets === null ? (
              <p className="text-sm text-ink-muted">Loading…</p>
            ) : openTickets.length === 0 ? (
              <p className="text-sm text-ink-muted">No open tickets right now.</p>
            ) : (
              openTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-background px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{ticket.subject}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {TICKET_CATEGORY_LABELS[ticket.category] ?? ticket.category} · {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge
                    label={ticket.priority}
                    variant={ticket.priority === "HIGH" ? "red" : ticket.priority === "MEDIUM" ? "yellow" : "muted"}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
