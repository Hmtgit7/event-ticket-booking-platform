"use client";

import { AdminSectionTitle } from "@/components/admin-dashboard/widgets/admin-section-title";
import { BarChart } from "@/components/charts/bar-chart";
import { ADMIN_REVENUE_CHART, ADMIN_EVENTS } from "@/constants/admin-dashboard-data";

const CATEGORY_BREAKDOWN = [
  { label: "Music",      value: 6110 },
  { label: "Tech",       value: 7420 },
  { label: "Food",       value: 5340 },
  { label: "Outdoor",    value: 4190 },
  { label: "Fashion",    value: 2870 },
  { label: "Health",     value: 940  },
];

const TOP_EVENTS = [...ADMIN_EVENTS].sort((a, b) =>
  parseInt(b.revenue.replace(/\D/g, "") || "0") -
  parseInt(a.revenue.replace(/\D/g, "") || "0")
).slice(0, 5);

/** Admin reports — revenue chart, category breakdown, top earners. */
export function AdminReportsContainer() {
  const totalRevenue = ADMIN_EVENTS.reduce(
    (sum, e) => sum + parseInt(e.revenue.replace(/\D/g, "") || "0", 10), 0
  );
  const totalTickets = ADMIN_EVENTS.reduce((sum, e) => sum + e.ticketsSold, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* ── KPI cards ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Gross Revenue",  value: `$${(totalRevenue / 1000).toFixed(1)}k` },
          { label: "Total Tickets Sold",   value: totalTickets.toLocaleString() },
          { label: "Avg. Revenue / Event", value: `$${Math.round(totalRevenue / ADMIN_EVENTS.length).toLocaleString()}` },
        ].map(({ label, value }) => (
          <article key={label} className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-sm text-ink-muted">{label}</p>
            <p className="mt-2 text-3xl font-black text-ink">{value}</p>
          </article>
        ))}
      </div>

      {/* ── Monthly revenue chart ── */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <AdminSectionTitle eyebrow="Trends" title="Monthly Revenue (×$1k)" />
        <div className="mt-5">
          <BarChart points={ADMIN_REVENUE_CHART} variant="capsule-line" accentIndex={9} height={200} />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {/* ── Category breakdown ── */}
        <div className="rounded-2xl border border-line bg-surface p-5">
          <AdminSectionTitle eyebrow="Categories" title="Tickets by Category" />
          <div className="mt-5">
            <BarChart points={CATEGORY_BREAKDOWN} variant="solid" height={160} />
          </div>
        </div>

        {/* ── Top earning events ── */}
        <div className="rounded-2xl border border-line bg-surface p-5">
          <AdminSectionTitle eyebrow="Top Events" title="Highest Revenue" />
          <div className="mt-4 flex flex-col gap-2">
            {TOP_EVENTS.map((event, i) => (
              <div key={event.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-background px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0 text-xs font-black text-ink-muted">#{i + 1}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{event.title}</p>
                    <p className="text-xs text-ink-muted">{event.ticketsSold.toLocaleString()} tickets</p>
                  </div>
                </div>
                <p className="shrink-0 text-sm font-black text-positive">{event.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
