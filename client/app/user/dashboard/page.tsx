import type { Metadata } from "next";
import { UserDashboardPage } from "@/pages/UserDashboardPage";

export const metadata: Metadata = { title: "Dashboard | GrabMyTicket" };

export default function UserDashboardRoute() {
  return <UserDashboardPage />;
}
