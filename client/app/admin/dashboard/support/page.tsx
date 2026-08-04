import type { Metadata } from "next";
import { AdminSupportContainer } from "@/containers/admin-dashboard/support/admin-support-container";

export const metadata: Metadata = { title: "Support | Admin | GrabMyTicket" };

export default function AdminSupportPage() {
  return <AdminSupportContainer />;
}
