import type { Metadata } from "next";
import { PublicEventsPage } from "@/pages/PublicEventsPage";

export const metadata: Metadata = {
  title: "Browse Events | GrabMyTicket",
  description: "Explore public events, shows, workshops, and experiences.",
};

export default function EventsPage() {
  return <PublicEventsPage />;
}
