import type { Metadata } from "next";
import { LegalPage } from "@/pages/LegalPage";

export const metadata: Metadata = { title: "Terms | GrabMyTicket" };

export default function TermsRoute() {
  return <LegalPage pageKey="terms" />;
}
