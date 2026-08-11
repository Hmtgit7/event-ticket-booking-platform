import type { Metadata } from "next";
import { EventDetail } from "@/containers/event-detail/event-detail";

interface EventPageProps {
  params: Promise<{ eventId: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  await params;
  // Private, noindex page (see layout.tsx) - a static title avoids an extra
  // server-side fetch just to echo the event name into the browser tab;
  // EventDetail already fetches and displays the real title in the page body.
  return { title: "Manage Event" };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { eventId } = await params;

  return (
    <div className="py-4">
      <EventDetail eventId={eventId} />
    </div>
  );
}
