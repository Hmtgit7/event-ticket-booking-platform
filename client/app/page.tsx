import type { Metadata } from "next";
import { MarketingPage } from "@/pages/MarketingPage";

export const metadata: Metadata = {
  title: "Book tickets for stand-up comedy & live shows",
  description:
    "GrabMyTicket makes it easy to discover and book tickets for stand-up comedy shows and live events near you. Browse by city, category, and price.",
};

export default function Home() {
  return <MarketingPage />;
}
