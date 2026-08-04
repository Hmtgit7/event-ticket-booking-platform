import type { Metadata } from "next";
import { RevenueContainer } from "@/containers/revenue/revenue-container";

export const metadata: Metadata = { title: "Revenue | GrabMyTicket" };

export default function RevenuePage() {
  return <RevenueContainer />;
}
