import type { Metadata } from "next";
import { EventDetail } from "@/containers/event-detail/event-detail";

interface EventPageProps {
  params: Promise<{ eventId: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { eventId } = await params;
  return { title: `${eventId} | GrabMyTicket` };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { eventId } = await params;

  return (
    <div className="py-4">
      <EventDetail eventId={eventId} />
    </div>
  );
}
