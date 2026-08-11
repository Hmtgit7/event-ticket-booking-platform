import type { Metadata } from "next";
import { PromotionsContainer } from "@/containers/promotions/promotions-container";

export const metadata: Metadata = { title: "Promotions" };

export default function PromotionsPage() {
  return <PromotionsContainer />;
}
