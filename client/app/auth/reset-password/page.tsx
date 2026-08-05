import type { Metadata } from "next";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";

export const metadata: Metadata = { title: "Reset Password | GrabMyTicket" };

export default function ResetPasswordRoute() {
  return <ResetPasswordPage />;
}
