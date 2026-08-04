import type { Metadata } from "next";
import { CreateEventContainer } from "@/containers/create-event/create-event-container";

export const metadata: Metadata = { title: "Create Event | GrabMyTicket" };

export default function CreateEventPage() {
  return <CreateEventContainer />;
}
