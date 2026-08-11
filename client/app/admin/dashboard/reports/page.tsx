import type { Metadata } from "next";
import { AdminReportsContainer } from "@/containers/admin-dashboard/reports/admin-reports-container";

export const metadata: Metadata = { title: "Reports | Admin" };

export default function AdminReportsPage() {
  return <AdminReportsContainer />;
}
