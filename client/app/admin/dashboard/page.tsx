import type { Metadata } from "next";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";

export const metadata: Metadata = { title: "Admin Dashboard | GrabMyTicket" };

export default function AdminDashboardRoute() {
  return <AdminDashboardPage />;
}
