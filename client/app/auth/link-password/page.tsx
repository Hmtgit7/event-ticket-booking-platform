import type { Metadata } from "next";
import { LinkPasswordPage } from "@/pages/LinkPasswordPage";

export const metadata: Metadata = { title: "Set Password | GrabMyTicket" };

export default function LinkPasswordRoute() {
  return <LinkPasswordPage />;
}
