import { redirect } from "next/navigation";

/**
 * /auth/forgot-password is no longer a real page - "forgot password" is a
 * client-side view-toggle inside AuthForm now (see components/auth/auth-form.tsx),
 * matching how Workday's own flow only exists as a state inside login, never a
 * pastable URL. This route-level redirect is defense-in-depth alongside the
 * same redirect in proxy.ts's middleware.
 */
export default function ForgotPasswordRoute() {
  redirect("/auth/login");
}
