import Link from "next/link";
import { AuthLayout } from "@/layouts/AuthLayout";

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
          Enter your email and we will send a secure reset link when email delivery is connected.
        </p>

        <form className="mt-7 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-ink">Email address</span>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-2 h-12 w-full rounded-xl border border-line bg-background px-4 text-sm text-ink outline-none focus:border-brand"
            />
          </label>
          <button type="button" className="h-12 w-full rounded-xl bg-brand text-sm font-bold text-brand-foreground shadow-sm">
            Send reset link
          </button>
        </form>

        <p className="mt-5 text-center text-xs font-medium text-ink-muted">
          Remembered it? <Link href="/auth/login" className="font-semibold text-brand hover:underline">Back to login</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
