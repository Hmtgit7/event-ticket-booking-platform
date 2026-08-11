import type { Metadata } from "next";
import { AttendeeInsights } from "@/containers/attendee-insights/attendee-insights";

interface InsightsPageProps {
  params: Promise<{ eventId: string }>;
}

export const metadata: Metadata = { title: "Attendee Insights" };

export default async function EventInsightsPage({ params }: InsightsPageProps) {
  const { eventId } = await params;

  return (
    <div className="py-4">
      <AttendeeInsights eventId={eventId} />
    </div>
  );
}
