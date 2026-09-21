"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthErrorBanner } from "@/components/auth/auth-error-banner";
import { AuthSuccessBanner } from "@/components/auth/auth-success-banner";
import { AwaitingVerification } from "@/components/auth/verify-email-status";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import { InfoTooltip } from "@/components/auth/info-tooltip";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { useTranslations } from "@/hooks/use-translations";
import { useSignup } from "@/modules/auth/hooks/use-signup";
import { validateSignup, type SignupErrors } from "@/modules/auth/utils/validate-auth";
import { cn } from "@/lib/utils";

export function SignupForm() {
  const t = useTranslations("auth");
  const { signup, isPending, errorMessage, linkPendingMessage, isAwaitingVerification } = useSignup();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [wantsToOrganize, setWantsToOrganize] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<SignupErrors>({});

  const hasValues = useMemo(
    () =>
      fullName.trim().length > 0 &&
      email.trim().length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0,
    [confirmPassword, email, fullName, password],
  );

  function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateSignup({ fullName, email, password, confirmPassword, acceptedTerms });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    signup({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      wantsToOrganize,
    });
  }

  if (isAwaitingVerification) {
    return <AwaitingVerification defaultEmail={email.trim().toLowerCase()} />;
  }

  return (
    <form className="space-y-3.5" noValidate onSubmit={submitSignup}>
      <GoogleSignInButton disabled={isPending} />

      <AuthDivider label={t("orCreateAccountWithEmail")} />

      <AuthErrorBanner message={errorMessage} />
      <AuthSuccessBanner message={linkPendingMessage} />

      <div className="space-y-3">
        <AuthInput
          id="signup-name"
          label={t("fullNameLabel")}
          type="text"
          autoComplete="name"
          placeholder={t("fullNamePlaceholder")}
          value={fullName}
          disabled={isPending}
          error={errors.fullName}
          onChange={(event) => {
            setFullName(event.target.value);
            setErrors((current) => ({ ...current, fullName: undefined }));
          }}
        />

        <AuthInput
          id="signup-email"
          label={t("emailLabel")}
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          disabled={isPending}
          error={errors.email}
          onChange={(event) => {
            setEmail(event.target.value);
            setErrors((current) => ({ ...current, email: undefined }));
          }}
        />

        <AuthInput
          id="signup-password"
          label={t("passwordLabel")}
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder={t("createPasswordPlaceholder")}
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
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
              disabled={isPending}
              className="rounded-lg p-1 text-ink-muted outline-none transition hover:bg-surface-hover hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
            </button>
          }
        />

        <AuthInput
          id="signup-confirm-password"
          label={t("confirmPasswordLabel")}
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder={t("confirmPasswordPlaceholder")}
          value={confirmPassword}
          disabled={isPending}
          error={errors.confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setErrors((current) => ({ ...current, confirmPassword: undefined }));
          }}
        />
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-hover/50 p-3">
          <span className="text-sm font-medium leading-5 text-ink-muted">
            <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
              {t("alsoHostEvents")}
              <InfoTooltip description={t("organizerTooltip")} />
            </span>
          </span>
          <ToggleSwitch
            id="wants-to-organize"
            checked={wantsToOrganize}
            disabled={isPending}
            onChange={setWantsToOrganize}
          />
        </div>

      <div className="space-y-1.5">
        <label className="flex cursor-pointer items-start gap-2.5 text-sm font-medium leading-5 text-ink-muted">
          <input
            type="checkbox"
            checked={acceptedTerms}
            disabled={isPending}
            onChange={(event) => {
              setAcceptedTerms(event.target.checked);
              setErrors((current) => ({ ...current, terms: undefined }));
            }}
            className="mt-0.5 size-4 rounded border-line accent-brand focus-visible:outline focus-visible:outline-3 focus-visible:outline-brand/25 disabled:cursor-not-allowed"
          />
          <span>
            {t("agreeToTermsPrefix")} <Link href="/terms" className="text-ink hover:underline">{t("termsLink")}</Link> {t("andWord")}{" "}
            <Link href="/privacy-policy" className="text-ink hover:underline">{t("privacyPolicyLink")}</Link>.
          </span>
        </label>
        {errors.terms ? <p className="text-xs font-medium text-destructive">{errors.terms}</p> : null}
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
        {t("createAccount")}
      </button>
    </form>
  );
}
