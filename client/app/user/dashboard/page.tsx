import type { Metadata } from "next";
import { OverviewContainer } from "@/containers/user-dashboard/overview/overview-container";

export const metadata: Metadata = { title: "My Dashboard" };

export default function UserDashboardPage() {
  return <OverviewContainer />;
}
