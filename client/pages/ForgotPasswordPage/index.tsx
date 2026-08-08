import { redirect } from "next/navigation";

/**
 * Orphaned - /auth/forgot-password no longer routes here (see
 * app/auth/forgot-password/page.tsx). "Forgot password" is now a client-side
 * view-toggle inside AuthForm/ForgotPasswordForm. Kept as a redirect only so
 * nothing that might still reference this component breaks.
 */
export function ForgotPasswordPage() {
  redirect("/auth/login");
}

export default ForgotPasswordPage;
