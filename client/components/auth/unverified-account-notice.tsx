"use client";

import { MailWarning } from "lucide-react";

import { AuthErrorBanner } from "@/components/auth/auth-error-banner";
import { useResendVerification } from "@/modules/auth/hooks/use-resend-verification";
import { cn } from "@/lib/utils";

/**
 * Shown on login when the credentials are correct but the account hasn't
 * verified its email yet - correct password, correct email, just not
 * verified. Sending happens only on explicit click, never automatically
 * (see AuthService.login - the auto-resend-on-every-attempt behavior was
 * deliberately removed).
 */
export function UnverifiedAccountNotice({ email, onBack }: { email: string; onBack: () => void }) {
  const { resend, isPending, isSuccess, errorMessage } = useResendVerification();

  return (
    <div className="mt-7 flex flex-col items-center gap-3 text-center">
      <MailWarning className="size-8 text-brand" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-ink">Please verify your account</h2>
      <p className="text-sm text-ink-muted">
        <span className="font-medium text-ink">{email}</span> hasn&apos;t been verified yet. Verify it to access your
        dashboard.
      </p>

      <div className="mt-1 w-full space-y-2">
        <button
          type="button"
          disabled={isPending || isSuccess}
          onClick={() => resend(email)}
          className={cn(
            "flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold outline-none transition disabled:cursor-not-allowed",
            isSuccess
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-brand text-brand-foreground shadow-sm hover:bg-brand/90 focus-visible:ring-3 focus-visible:ring-brand/25",
          )}
        >
          {isSuccess ? "Verification link sent" : isPending ? "Sending…" : "Send Verification Link"}
        </button>

        {isSuccess ? (
          <p className="text-xs text-emerald-600">Check your inbox and click the link to continue.</p>
        ) : null}
        <AuthErrorBanner message={errorMessage} />
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-2 text-sm font-medium text-ink-muted underline-offset-4 outline-none transition hover:text-ink hover:underline"
      >
        Back to login
      </button>
    </div>
  );
}
