"use client";

import { FormEvent, useMemo, useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthErrorBanner } from "@/components/auth/auth-error-banner";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { UnverifiedAccountNotice } from "@/components/auth/unverified-account-notice";
import { useLogin } from "@/modules/auth/hooks/use-login";
import { validateCredentials, type CredentialErrors } from "@/modules/auth/utils/validate-auth";
import { cn } from "@/lib/utils";

export function AuthForm() {
  const { login, isPending, isUnverified, reset, errorMessage } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<CredentialErrors>({});
  // "forgot" is a view-toggle, never a route - there is no /auth/forgot-password
  // page to paste a URL into (matches Workday: it only exists as a state inside
  // the login screen).
  const [mode, setMode] = useState<"login" | "forgot">("login");

  const hasValues = useMemo(
    () => email.trim().length > 0 && password.length > 0,
    [email, password],
  );

  function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateCredentials(email, password);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    login({ email: email.trim().toLowerCase(), password });
  }

  if (mode === "forgot") {
    return <ForgotPasswordForm onBack={() => setMode("login")} />;
  }

  // Correct credentials, just not verified yet - dedicated screen with an
  // explicit resend button, not a generic error banner on the login form.
  if (isUnverified) {
    return (
      <UnverifiedAccountNotice email={email.trim().toLowerCase()} onBack={reset} />
    );
  }

  return (
    <form className="space-y-3.5" noValidate onSubmit={submitEmail}>
      <GoogleSignInButton disabled={isPending} />

      <AuthDivider label="or continue with email" />

      <AuthErrorBanner message={errorMessage} />

      <div className="space-y-3">
        <AuthInput
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          disabled={isPending}
          error={errors.email}
          onChange={(event) => {
            setEmail(event.target.value);
            setErrors((current) => ({ ...current, email: undefined }));
          }}
        />

        <AuthInput
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          disabled={isPending}
          error={errors.password}
          onChange={(event) => {
            setPassword(event.target.value);
            setErrors((current) => ({ ...current, password: undefined }));
          }}
          action={
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isPending}
              className="rounded-lg p-1 text-ink-muted outline-none transition hover:bg-surface-hover hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          }
        />
      </div>

      <div className="flex justify-end text-sm font-medium text-ink-muted">
        <button
          type="button"
          onClick={() => setMode("forgot")}
          className="text-brand underline-offset-4 outline-none transition hover:underline focus-visible:rounded focus-visible:ring-3 focus-visible:ring-brand/20"
        >
          Forgot Password?
        </button>
      </div>

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
        Login
      </button>
    </form>
  );
}
