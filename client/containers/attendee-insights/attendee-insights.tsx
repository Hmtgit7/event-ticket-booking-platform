import { getAttendeeInsight } from "@/constants/attendee-insights";
import { DonutChart } from "@/components/charts/donut-chart";
import { BarChart } from "@/components/charts/bar-chart";

interface AttendeeInsightsProps {
  eventId: string;
}

/** Per-event analytics page: total attendee count, gender + age donuts,
 * and top-location / top-category bar charts. */
export function AttendeeInsights({ eventId }: AttendeeInsightsProps) {
  const insight = getAttendeeInsight(eventId);

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <div className="flex flex-col gap-5">
        <div className="rounded-3xl bg-surface p-6 shadow-sm">
          <p className="text-3xl font-bold text-ink">{insight.totalAttendees.toLocaleString()}</p>
          <p className="mt-1 text-sm text-ink-muted">Total Number of Attendees</p>
          <p className="text-xs text-ink-muted">For this month</p>
        </div>

        <div className="rounded-3xl bg-surface p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Gender</h2>
            <ul className="flex gap-3 text-xs text-ink-muted">
              {insight.genderSplit.map((segment) => (
                <li key={segment.label} className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm" style={{ backgroundColor: segment.color }} />
                  {segment.value}%
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center py-2">
            <DonutChart segments={insight.genderSplit} size={190} />
          </div>
          <div className="flex justify-center gap-6 text-xs text-ink-muted">
            {insight.genderSplit.map((segment) => (
              <span key={segment.label}>{segment.label}</span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-surface p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-ink">Age Category</h2>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <DonutChart segments={insight.ageBreakdown} size={150} strokeWidth={26} />
            <ul className="flex flex-col gap-1.5 text-xs text-ink-muted">
              {insight.ageBreakdown.map((segment) => (
                <li key={segment.label} className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm" style={{ backgroundColor: segment.color }} />
                  {segment.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 xl:col-span-2">
        <div className="rounded-3xl bg-surface p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-ink">Top most Location</h2>
          <BarChart points={insight.topLocations} variant="solid" height={220} />
        </div>

        <div className="rounded-3xl bg-surface p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-ink">Top most Category</h2>
          <BarChart points={insight.topCategories} variant="stem-dot-line" height={180} />
        </div>
      </div>
    </div>
  );
}
