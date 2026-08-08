"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { KeyRound, MailWarning } from "lucide-react";

import { SetNewPasswordForm } from "@/components/auth/set-new-password-form";
import { useResetPassword } from "@/modules/auth/hooks/use-reset-password";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const { submit, isPending, errorMessage } = useResetPassword();

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <MailWarning className="size-8 text-destructive" aria-hidden="true" />
        <h1 className="text-xl font-semibold text-ink">Invalid reset link</h1>
        <p className="text-sm text-ink-muted">This link is missing its token. Go back to login and request a new one.</p>
        <Link href="/auth/login" className="mt-1 text-sm font-semibold text-brand underline-offset-4 hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-2 text-center">
        <KeyRound className="size-8 text-brand" aria-hidden="true" />
        <h1 className="text-xl font-semibold text-ink">Choose a new password</h1>
        <p className="text-sm text-ink-muted">Enter a new password for your GrabMyTicket account.</p>
      </div>
      <SetNewPasswordForm
        onSubmit={(password) => submit({ token, newPassword: password })}
        isPending={isPending}
        errorMessage={errorMessage}
        submitLabel="Reset password"
      />
    </div>
  );
}
