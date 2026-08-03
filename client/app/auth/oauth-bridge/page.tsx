import type { Metadata } from "next";
import { OAuthBridgePage } from "@/pages/OAuthBridgePage";

export const metadata: Metadata = { title: "Signing you in… | GrabMyTicket" };

export default function OAuthBridgeRoute() {
  return <OAuthBridgePage />;
}
