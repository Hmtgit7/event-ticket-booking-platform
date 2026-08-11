import type { Metadata } from "next";
import { AttendeeInsights } from "@/containers/attendee-insights/attendee-insights";
import { MOCK_EVENTS } from "@/constants/mock-events";

export const metadata: Metadata = { title: "Attendee Insights" };

/** Sidebar-level "Attendee Insights" entry — shows insights for the
 * first active event by default, since insights are always scoped to
 * one event underneath /dashboard/events/[eventId]/insights. */
export default function InsightsPage() {
  const defaultEventId = MOCK_EVENTS[0]?.id ?? "default";

  return (
    <div className="py-4">
      <AttendeeInsights eventId={defaultEventId} />
    </div>
  );
}
