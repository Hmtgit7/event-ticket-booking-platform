import type { Metadata } from "next";
import { LegalPage } from "@/pages/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy | GrabMyTicket" };

export default function PrivacyPolicyRoute() {
  return <LegalPage pageKey="privacy" />;
}
