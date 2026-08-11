import type { Metadata } from "next";
import { AdminOverviewContainer } from "@/containers/admin-dashboard/overview/admin-overview-container";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default function AdminDashboardRoute() {
  return <AdminOverviewContainer />;
}
