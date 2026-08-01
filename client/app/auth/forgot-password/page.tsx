import type { Metadata } from "next";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";

export const metadata: Metadata = { title: "Forgot Password | GrabMyTicket" };

export default function ForgotPasswordRoute() {
  return <ForgotPasswordPage />;
}
