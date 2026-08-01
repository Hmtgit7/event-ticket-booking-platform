import type { Metadata } from "next";
import { EventsList } from "@/containers/events-list/events-list";

export const metadata: Metadata = { title: "Events | GrabMyTicket" };

export default function EventsPage() {
  return (
    <div className="py-4">
      <EventsList />
    </div>
  );
}
