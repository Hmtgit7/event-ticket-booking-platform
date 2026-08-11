import type { Metadata } from "next";
import { LegalPage } from "@/pages/LegalPage";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsRoute() {
  return <LegalPage pageKey="terms" />;
}
