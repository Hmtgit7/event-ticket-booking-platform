"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, MailCheck } from "lucide-react";

import { AuthInput } from "@/components/auth/auth-input";
import { AuthErrorBanner } from "@/components/auth/auth-error-banner";
import { useForgotPassword } from "@/modules/auth/hooks/use-forgot-password";
import { cn } from "@/lib/utils";

/**
 * Rendered as a view-toggle inside AuthForm, not a standalone route - there is no
 * /auth/forgot-password page. This intentionally mirrors how consumer auth flows
 * like Workday's handle "forgot password": it only exists as a state within the
 * login screen, reachable by clicking through, never by pasting a URL directly.
 */
export function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const { submit, isPending, isSuccess, errorMessage } = useForgotPassword();
  const [email, setEmail] = useState("");

  if (isSuccess) {
    return (
      <div className="mt-7 flex flex-col items-center gap-3 text-center">
        <MailCheck className="size-8 text-emerald-500" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-ink">Check your inbox</h2>
        <p className="text-sm text-ink-muted">
          If an account exists for <span className="font-medium text-ink">{email}</span>, we&apos;ve sent a link to
          reset your password.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-1 text-sm font-semibold text-brand underline-offset-4 hover:underline"
        >
          Back to login
        </button>
      </div>
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }
    submit(email.trim().toLowerCase());
  }

  return (
    <form className="mt-7 space-y-4" noValidate onSubmit={onSubmit}>
      <AuthErrorBanner message={errorMessage} />
      <AuthInput
        id="forgot-password-email"
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        disabled={isPending}
        onChange={(event) => setEmail(event.target.value)}
      />
      <button
        type="submit"
        disabled={isPending || !email.trim()}
        className={cn(
          "flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold shadow-sm outline-none transition disabled:cursor-not-allowed",
          email.trim()
            ? "bg-brand text-brand-foreground hover:bg-brand/90"
            : "bg-surface-hover text-ink-muted shadow-none",
        )}
      >
        {isPending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
        Send reset link
      </button>
      <button
        type="button"
        onClick={onBack}
        className="block w-full text-center text-sm font-medium text-ink-muted underline-offset-4 outline-none transition hover:text-ink hover:underline"
      >
        Back to login
      </button>
    </form>
  );
}
