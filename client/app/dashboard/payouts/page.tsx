import type { Metadata } from "next";
import { PayoutsContainer } from "@/containers/payouts/payouts-container";

export const metadata: Metadata = { title: "Payouts" };

export default function PayoutsPage() {
  return <PayoutsContainer />;
}
