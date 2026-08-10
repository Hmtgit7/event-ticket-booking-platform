"use client";

import { BarChart } from "@/components/charts/bar-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { REVENUE_BREAKDOWN, TICKET_SUMMARY } from "@/constants/dashboard-stats";
import { MOCK_EVENTS } from "@/constants/mock-events";

const EVENT_REVENUE = MOCK_EVENTS.map((event) => ({
  label: event.title.split(" ").slice(0, 2).join(" "),
  value: typeof event.price === "number" ? event.price * (event.ticketsSoldPct * 10) : 0,
}));

export function RevenueContainer() {
  const totalRevenue = EVENT_REVENUE.reduce((sum, event) => sum + event.value, 0);
  const totalTickets = MOCK_EVENTS.reduce((sum, event) => sum + event.totalTicketsBooked, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Gross Revenue", value: `$${(totalRevenue / 1000).toFixed(1)}k` },
          { label: "Total Tickets Sold", value: totalTickets.toLocaleString() },
          { label: "Avg. Revenue / Event", value: `$${Math.round(totalRevenue / MOCK_EVENTS.length).toLocaleString()}` },
        ].map(({ label, value }) => (
          <article key={label} className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-sm text-ink-muted">{label}</p>
            <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">Trends</p>
          <h2 className="mt-1 text-xl font-bold text-ink">Monthly Revenue (x$1k)</h2>
          <div className="mt-5">
            <BarChart points={REVENUE_BREAKDOWN} variant="capsule-line" accentIndex={7} height={200} />
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">Breakdown</p>
          <h2 className="mt-1 text-xl font-bold text-ink">Ticket Types</h2>
          <div className="mt-4 flex justify-center py-2">
            <DonutChart segments={TICKET_SUMMARY.segments} centerValue={TICKET_SUMMARY.totalRevenue} showPercentLabels />
          </div>
          <ul className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-ink-muted">
            {TICKET_SUMMARY.segments.map((segment) => (
              <li key={segment.label} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm" style={{ backgroundColor: segment.color }} />
                {segment.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">Per Event</p>
        <h2 className="mb-5 mt-1 text-xl font-bold text-ink">Revenue by Event</h2>
        <BarChart points={EVENT_REVENUE} variant="solid" height={160} />
      </div>
    </div>
  );
}
