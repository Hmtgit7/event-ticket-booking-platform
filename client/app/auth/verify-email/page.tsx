import type { Metadata } from "next";
import { VerifyEmailPage } from "@/pages/VerifyEmailPage";

export const metadata: Metadata = { title: "Verify Email", robots: { index: false } };

export default function VerifyEmailRoute() {
  return <VerifyEmailPage />;
}
