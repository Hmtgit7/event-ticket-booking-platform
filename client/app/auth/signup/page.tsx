import type { Metadata } from "next";
import { SignupPage } from "@/pages/SignupPage";

export const metadata: Metadata = { title: "Sign Up" };

export default function SignupRoute() {
  return <SignupPage />;
}
