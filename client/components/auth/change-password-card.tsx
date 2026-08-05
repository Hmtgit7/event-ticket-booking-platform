"use client";

import { FormEvent, useState } from "react";
import { KeyRound, LoaderCircle } from "lucide-react";

import { AuthInput } from "@/components/auth/auth-input";
import { AuthErrorBanner } from "@/components/auth/auth-error-banner";
import { AuthSuccessBanner } from "@/components/auth/auth-success-banner";
import { useCurrentUser } from "@/modules/auth/hooks/use-current-user";
import { useChangePassword } from "@/modules/auth/hooks/use-change-password";
import { useForgotPassword } from "@/modules/auth/hooks/use-forgot-password";
import { cn } from "@/lib/utils";

/**
 * Settings-page password card. Shape adapts to the account:
 * - No password yet (Google-only account) -> just "new password", no current-password field.
 * - Already has a password -> "current password" required, plus a "forgot password?" escape hatch
 *   for people who are logged in via Google/an active session but genuinely don't remember it.
 */
export function ChangePasswordCard() {
  const { data: user, isLoading } = useCurrentUser();
  const { submit, isPending, isSuccess, errorMessage, reset } = useChangePassword();
  const forgotPassword = useForgotPassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  if (isLoading || !user) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="text-sm text-ink-muted">Loading security settings…</p>
      </div>
    );
  }

  const hasPassword = user.hasPassword;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);
    reset();

    if (newPassword.length < 8) {
      setLocalError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (hasPassword && !currentPassword) {
      setLocalError("Enter your current password.");
      return;
    }

    submit(hasPassword ? { currentPassword, newPassword } : { newPassword }, {
      onSuccess: () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      },
    });
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center gap-2">
        <KeyRound className="size-5 text-brand" aria-hidden="true" />
        <h2 className="text-base font-semibold text-ink">{hasPassword ? "Change password" : "Set a password"}</h2>
      </div>
      <p className="mt-1 text-sm text-ink-muted">
        {hasPassword
          ? "Update the password used to log in with your email."
          : "You currently only sign in with Google. Add a password so you can log in either way."}
      </p>

      <form className="mt-5 space-y-3.5" noValidate onSubmit={onSubmit}>
        <AuthErrorBanner message={localError ?? errorMessage} />
        <AuthSuccessBanner message={isSuccess ? "Password updated successfully." : null} />

        {hasPassword ? (
          <AuthInput
            id="current-password"
            label="Current password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            disabled={isPending}
            onChange={(event) => {
              setCurrentPassword(event.target.value);
              setLocalError(null);
            }}
          />
        ) : null}

        <AuthInput
          id="new-password-settings"
          label="New password"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          disabled={isPending}
          onChange={(event) => {
            setNewPassword(event.target.value);
            setLocalError(null);
          }}
        />

        <AuthInput
          id="confirm-password-settings"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          disabled={isPending}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setLocalError(null);
          }}
        />

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "flex h-10 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm outline-none transition hover:bg-brand/90 focus-visible:ring-3 focus-visible:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-60",
            )}
          >
            {isPending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
            {hasPassword ? "Update password" : "Set password"}
          </button>

          {hasPassword ? (
            <button
              type="button"
              disabled={forgotPassword.isPending || forgotPassword.isSuccess}
              onClick={() => forgotPassword.submit(user.email)}
              className="text-sm font-semibold text-brand underline-offset-4 outline-none hover:underline disabled:cursor-not-allowed disabled:opacity-60"
            >
              Forgot password?
            </button>
          ) : null}
        </div>

        {forgotPassword.isSuccess ? (
          <p className="text-xs text-emerald-600">We&apos;ve sent a password reset link to {user.email}.</p>
        ) : null}
      </form>
    </div>
  );
}
