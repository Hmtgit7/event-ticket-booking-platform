import { redirect } from "next/navigation";

export default function MisspelledSignupRoute() {
  redirect("/auth/signup");
}
