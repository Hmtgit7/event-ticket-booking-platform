import type { Metadata } from "next";
import { AuthPage } from "@/pages/AuthPage";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return <AuthPage />;
}
