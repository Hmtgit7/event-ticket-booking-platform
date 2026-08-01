"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthInput } from "@/components/auth/auth-input";
import { GoogleIcon } from "@/components/auth/google-icon";
import { cn } from "@/lib/utils";

type SignupErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
};

function validateSignup(values: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}): SignupErrors {
  const errors: SignupErrors = {};

  if (!values.name.trim()) {
    errors.name = "Full name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!values.acceptedTerms) {
    errors.terms = "Accept the terms to continue.";
  }

  return errors;
}

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const hasValues = useMemo(
    () =>
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0,
    [confirmPassword, email, name, password],
  );

  function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateSignup({
      name,
      email,
      password,
      confirmPassword,
      acceptedTerms,
    });
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
    <form className="space-y-3.5" noValidate onSubmit={submitSignup}>
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

      <AuthDivider label="or create account with email" />

      <div className="space-y-3">
        <AuthInput
          id="signup-name"
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Alex Morgan"
          value={name}
          disabled={isBusy}
          error={errors.name}
          onChange={(event) => {
            setName(event.target.value);
            setErrors((current) => ({ ...current, name: undefined }));
          }}
        />

        <AuthInput
          id="signup-email"
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
          id="signup-password"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Create a password"
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

        <AuthInput
          id="signup-confirm-password"
          label="Confirm password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Confirm your password"
          value={confirmPassword}
          disabled={isBusy}
          error={errors.confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setErrors((current) => ({ ...current, confirmPassword: undefined }));
          }}
        />
      </div>

      <div className="space-y-1.5">
        <label className="flex cursor-pointer items-start gap-2.5 text-sm font-medium leading-5 text-ink-muted">
          <input
            type="checkbox"
            checked={acceptedTerms}
            disabled={isBusy}
            onChange={(event) => {
              setAcceptedTerms(event.target.checked);
              setErrors((current) => ({ ...current, terms: undefined }));
            }}
            className="mt-0.5 size-4 rounded border-line accent-brand focus-visible:outline focus-visible:outline-3 focus-visible:outline-brand/25 disabled:cursor-not-allowed"
          />
          <span>
            I agree to the <Link href="/terms" className="text-ink hover:underline">Terms</Link> and <Link href="/privacy-policy" className="text-ink hover:underline">Privacy Policy</Link>.
          </span>
        </label>
        {errors.terms ? (
          <p className="text-xs font-medium text-destructive">{errors.terms}</p>
        ) : null}
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
        Create account
      </button>
    </form>
  );
}

