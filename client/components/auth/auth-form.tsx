"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthInput } from "@/components/auth/auth-input";
import { GoogleIcon } from "@/components/auth/google-icon";
import { cn } from "@/lib/utils";

type AuthErrors = {
  email?: string;
  password?: string;
};

function validateAuth(email: string, password: string): AuthErrors {
  const errors: AuthErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
}

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const hasValues = useMemo(
    () => email.trim().length > 0 && password.length > 0,
    [email, password],
  );

  function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateAuth(email, password);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsEmailLoading(true);
    window.setTimeout(() => setIsEmailLoading(false), 900);
  }

  function continueWithGoogle() {
    setIsGoogleLoading(true);
    window.setTimeout(() => setIsGoogleLoading(false), 900);
  }

  const isBusy = isEmailLoading || isGoogleLoading;

  return (
    <form className="space-y-3.5" noValidate onSubmit={submitEmail}>
      <button
        type="button"
        onClick={continueWithGoogle}
        disabled={isBusy}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-line bg-background px-3 text-sm font-semibold text-ink outline-none transition hover:border-brand/40 hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isGoogleLoading ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <GoogleIcon />
        )}
        <span>Continue with Google</span>
      </button>

      <AuthDivider label="or continue with email" />

      <div className="space-y-3">
        <AuthInput
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          disabled={isBusy}
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
          disabled={isBusy}
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
              disabled={isBusy}
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

      <div className="flex flex-col gap-2 text-sm font-medium text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={rememberMe}
            disabled={isBusy}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="size-4 rounded border-line accent-brand focus-visible:outline focus-visible:outline-3 focus-visible:outline-brand/25 disabled:cursor-not-allowed"
          />
          <span>Remember me</span>
        </label>

        <Link
          href="/auth/forgot-password"
          className="text-brand underline-offset-4 outline-none transition hover:underline focus-visible:rounded focus-visible:ring-3 focus-visible:ring-brand/20"
        >
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isBusy || !hasValues}
        className={cn(
          "flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold outline-none transition focus-visible:ring-3 disabled:cursor-not-allowed",
          hasValues
            ? "bg-brand text-brand-foreground shadow-sm hover:bg-brand/90 focus-visible:ring-brand/25"
            : "bg-surface-hover text-ink-muted focus-visible:ring-line",
        )}
      >
        {isEmailLoading ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : null}
        Login
      </button>
    </form>
  );
}


