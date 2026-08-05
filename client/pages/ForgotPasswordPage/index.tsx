import Link from "next/link";
import { AuthLayout } from "@/layouts/AuthLayout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-[420px]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-muted">
          Account recovery
        </p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          Reset your password.
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink-muted">
          Enter your email and we&apos;ll send you a secure reset link.
        </p>

        <ForgotPasswordForm />

        <p className="mt-5 text-center text-xs font-medium text-ink-muted">
          Remembered it? <Link href="/auth/login" className="font-semibold text-brand hover:underline">Back to login</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
