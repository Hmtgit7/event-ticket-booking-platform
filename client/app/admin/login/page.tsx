import type { Metadata } from "next";
import { AdminLoginPage } from "@/pages/AdminLoginPage";

export const metadata: Metadata = { title: "Admin Login | GrabMyTicket" };

export default function AdminLoginRoute() {
  return <AdminLoginPage />;
}
