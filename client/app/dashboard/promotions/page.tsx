import type { Metadata } from "next";
import { PromotionsContainer } from "@/containers/promotions/promotions-container";

export const metadata: Metadata = { title: "Promotions | GrabMyTicket" };

export default function PromotionsPage() {
  return <PromotionsContainer />;
}
