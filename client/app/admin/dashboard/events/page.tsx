import type { Metadata } from "next";
import { AdminEventsContainer } from "@/containers/admin-dashboard/events/admin-events-container";

export const metadata: Metadata = { title: "Events | Admin | GrabMyTicket" };

export default function AdminEventsPage() {
  return <AdminEventsContainer />;
}
