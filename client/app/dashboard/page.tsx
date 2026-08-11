import type { Metadata } from "next";
import { DashboardOverview } from "@/containers/dashboard-overview/dashboard-overview";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="py-4">
      <DashboardOverview />
    </div>
  );
}
