"use client";

import { BarChart } from "@/components/charts/bar-chart";
import { REVENUE_BREAKDOWN, TICKET_SUMMARY } from "@/constants/dashboard-stats";
import { MOCK_EVENTS } from "@/constants/mock-events";
import { DonutChart } from "@/components/charts/donut-chart";

const EVENT_REVENUE = MOCK_EVENTS.map((e) => ({
  label: e.title.split(" ").slice(0, 2).join(" "),
  value: typeof e.price === "number" ? e.price * (e.ticketsSoldPct * 10) : 0,
}));

/** Organizer revenue analytics page. */
export function RevenueContainer() {
  const totalRevenue = EVENT_REVENUE.reduce((s, e) => s + e.value, 0);
  const totalTickets = MOCK_EVENTS.reduce((s, e) => s + e.totalTicketsBooked, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* ── KPIs ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Gross Revenue",       value: `$${(totalRevenue / 1000).toFixed(1)}k` },
          { label: "Total Tickets Sold",  value: totalTickets.toLocaleString() },
          { label: "Avg. Revenue / Event",value: `$${Math.round(totalRevenue / MOCK_EVENTS.length).toLocaleString()}` },
        ].map(({ label, value }) => (
          <article key={label} className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-sm text-ink-muted">{label}</p>
            <p className="mt-2 text-3xl font-black text-ink">{value}</p>
          </article>
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">Trends</p>
          <h2 className="mt-1 font-heading text-xl font-extrabold text-ink">Monthly Revenue (×$1k)</h2>
          <div className="mt-5">
            <BarChart points={REVENUE_BREAKDOWN} variant="capsule-line" accentIndex={7} height={200} />
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">Breakdown</p>
          <h2 className="mt-1 font-heading text-xl font-extrabold text-ink">Ticket Types</h2>
          <div className="mt-4 flex justify-center py-2">
            <DonutChart segments={TICKET_SUMMARY.segments} centerValue={TICKET_SUMMARY.totalRevenue} showPercentLabels />
          </div>
          <ul className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-ink-muted">
            {TICKET_SUMMARY.segments.map((s) => (
              <li key={s.label} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
                {s.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Per-event revenue ── */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">Per Event</p>
        <h2 className="mt-1 font-heading text-xl font-extrabold text-ink mb-5">Revenue by Event</h2>
        <BarChart points={EVENT_REVENUE} variant="solid" height={160} />
      </div>
    </div>
  );
}
