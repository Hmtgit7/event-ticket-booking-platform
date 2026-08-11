import type { Metadata } from "next";
import { AdminBookingsContainer } from "@/containers/admin-dashboard/bookings/admin-bookings-container";

export const metadata: Metadata = { title: "Bookings | Admin" };

export default function AdminBookingsPage() {
  return <AdminBookingsContainer />;
}
