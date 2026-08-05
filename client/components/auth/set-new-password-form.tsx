"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

import { AuthInput } from "@/components/auth/auth-input";
import { AuthErrorBanner } from "@/components/auth/auth-error-banner";
import { cn } from "@/lib/utils";

interface SetNewPasswordFormProps {
  onSubmit: (password: string) => void;
  isPending: boolean;
  errorMessage: string | null;
  submitLabel: string;
}

/** Shared by ResetPasswordForm and LinkPasswordForm - both are "type a new password, submit, get logged in". */
export function SetNewPasswordForm({ onSubmit, isPending, errorMessage, submitLabel }: SetNewPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    setLocalError(null);
    onSubmit(password);
  }

  const hasValues = password.length > 0 && confirmPassword.length > 0;

  return (
    <form className="mt-6 space-y-3.5" noValidate onSubmit={submit}>
      <AuthErrorBanner message={localError ?? errorMessage} />

      <AuthInput
        id="new-password"
        label="New password"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="Create a password"
        value={password}
        disabled={isPending}
        onChange={(event) => {
          setPassword(event.target.value);
          setLocalError(null);
        }}
        action={
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={isPending}
            className="rounded-lg p-1 text-ink-muted outline-none transition hover:bg-surface-hover hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
          </button>
        }
      />

      <AuthInput
        id="confirm-new-password"
        label="Confirm new password"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="Confirm your password"
        value={confirmPassword}
        disabled={isPending}
        onChange={(event) => {
          setConfirmPassword(event.target.value);
          setLocalError(null);
        }}
      />

      <button
        type="submit"
        disabled={isPending || !hasValues}
        className={cn(
          "flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold outline-none transition focus-visible:ring-3 disabled:cursor-not-allowed",
          hasValues
            ? "bg-brand text-brand-foreground shadow-sm hover:bg-brand/90 focus-visible:ring-brand/25"
            : "bg-surface-hover text-ink-muted focus-visible:ring-line",
        )}
      >
        {isPending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
        {submitLabel}
      </button>
    </form>
  );
}
