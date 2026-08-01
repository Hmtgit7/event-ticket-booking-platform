import { DASHBOARD_STATS, REVENUE_BREAKDOWN, TICKET_SUMMARY } from "@/constants/dashboard-stats";
import { MOCK_EVENTS, UPCOMING_EVENT_IDS } from "@/constants/mock-events";
import { StatCard } from "@/components/common/stat-card";
import { BarChart } from "@/components/charts/bar-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { MockMap } from "@/components/common/mock-map";
import { MiniCalendar } from "@/components/dashboard/mini-calendar";
import { UpcomingEventItem } from "@/components/dashboard/upcoming-event-item";
import { Ticket, Wallet, TrendingUp } from "lucide-react";

/** Composes the full /dashboard overview: stat cards, revenue chart,
 * ticket summary donut, upcoming events + mock map, and the mini
 * calendar. A server component — every interactive leaf below it is
 * its own "use client" island. */
export function DashboardOverview() {
  const upcoming = MOCK_EVENTS.filter((event) => UPCOMING_EVENT_IDS.includes(event.id));
  const featuredEvent = upcoming[0];

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <div className="flex flex-col gap-5 xl:col-span-2">
        <div className="flex flex-col gap-4 sm:flex-row">
          {DASHBOARD_STATS.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>

        <div className="rounded-3xl bg-surface p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Revenue Breakdown</h2>
            <button type="button" className="text-sm font-medium text-ink-muted hover:text-ink">
              see details
            </button>
          </div>
          <BarChart points={REVENUE_BREAKDOWN} variant="capsule-line" accentIndex={7} />
        </div>

        <div className="rounded-3xl bg-surface p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Upcoming Events</h2>
            <button type="button" className="text-sm font-medium text-ink-muted hover:text-ink">
              More
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              {upcoming.map((event) => (
                <UpcomingEventItem key={event.id} event={event} />
              ))}
            </div>
            {featuredEvent && <MockMap location={featuredEvent.location} />}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-3xl bg-surface p-5 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-ink">Ticket Summary</h2>
          <div className="flex justify-center py-2">
            <DonutChart segments={TICKET_SUMMARY.segments} centerValue={`${TICKET_SUMMARY.conversionRatePct}%`} showPercentLabels />
          </div>
          <ul className="mb-4 flex flex-wrap justify-center gap-3 text-xs text-ink-muted">
            {TICKET_SUMMARY.segments.map((segment) => (
              <li key={segment.label} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm" style={{ backgroundColor: segment.color }} />
                {segment.label}
              </li>
            ))}
          </ul>
          <SummaryRow icon={Ticket} label="Total Ticket Sold" value={TICKET_SUMMARY.totalTicketsSold.toLocaleString()} />
          <SummaryRow icon={Wallet} label="Total Revenue" value={TICKET_SUMMARY.totalRevenue} />
          <SummaryRow icon={TrendingUp} label="Conversation Rate" value={`${TICKET_SUMMARY.conversionRatePct}%`} />
        </div>

        <MiniCalendar />
      </div>
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value }: { icon: typeof Ticket; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-t border-line py-2.5 text-sm first:border-t-0">
      <span className="flex items-center gap-2 text-ink-muted">
        <Icon className="size-4" />
        {label}
      </span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}
