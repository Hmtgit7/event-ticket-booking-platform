import type { Metadata } from "next";
import { SupportContainer } from "@/containers/user-dashboard/support/support-container";

export const metadata: Metadata = { title: "Support" };

export default function UserSupportPage() {
  return <SupportContainer />;
}
