"use client";

import { FormEvent, useMemo, useState } from "react";
import { LoaderCircle } from "lucide-react";

import { AuthInput } from "@/components/auth/auth-input";
import { AuthErrorBanner } from "@/components/auth/auth-error-banner";
import { useAdminLogin } from "@/modules/auth/hooks/use-admin-login";
import { validateCredentials, type CredentialErrors } from "@/modules/auth/utils/validate-auth";
import { cn } from "@/lib/utils";

export function AdminLoginForm() {
  const { login, isPending, errorMessage } = useAdminLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<CredentialErrors>({});

  const hasValues = useMemo(() => email.trim().length > 0 && password.length > 0, [email, password]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateCredentials(email, password);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    login({ email: email.trim().toLowerCase(), password });
  }

  return (
    <form className="space-y-3.5" noValidate onSubmit={submit} suppressHydrationWarning>
      <AuthErrorBanner message={errorMessage} />

      <AuthInput
        id="admin-email"
        label="Admin email"
        type="email"
        autoComplete="email"
        placeholder="admin@grabmyticket.com"
        value={email}
        disabled={isPending}
        error={errors.email}
        onChange={(event) => {
          setEmail(event.target.value);
          setErrors((current) => ({ ...current, email: undefined }));
        }}
      />

      <AuthInput
        id="admin-password"
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter your password"
        value={password}
        disabled={isPending}
        error={errors.password}
        onChange={(event) => {
          setPassword(event.target.value);
          setErrors((current) => ({ ...current, password: undefined }));
        }}
      />

      <button
        type="submit"
        disabled={isPending || !hasValues}
        suppressHydrationWarning
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
