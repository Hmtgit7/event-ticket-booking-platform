"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { KeyRound, MailWarning } from "lucide-react";

import { SetNewPasswordForm } from "@/components/auth/set-new-password-form";
import { useLinkPassword } from "@/modules/auth/hooks/use-link-password";

export function LinkPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const { submit, isPending, errorMessage } = useLinkPassword();

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <MailWarning className="size-8 text-destructive" aria-hidden="true" />
        <h1 className="text-xl font-semibold text-ink">Invalid link</h1>
        <p className="text-sm text-ink-muted">This link is missing its token. Try signing up again to get a new one.</p>
        <Link href="/auth/signup" className="mt-1 text-sm font-semibold text-brand underline-offset-4 hover:underline">
          Back to signup
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-2 text-center">
        <KeyRound className="size-8 text-brand" aria-hidden="true" />
        <h1 className="text-xl font-semibold text-ink">Set your password</h1>
        <p className="text-sm text-ink-muted">
          Add a password to your account so you can log in either with Google or with your email and password.
        </p>
      </div>
      <SetNewPasswordForm
        onSubmit={(password) => submit({ token, newPassword: password })}
        isPending={isPending}
        errorMessage={errorMessage}
        submitLabel="Set password"
      />
    </div>
  );
}
