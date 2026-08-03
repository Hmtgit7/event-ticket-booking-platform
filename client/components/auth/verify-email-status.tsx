"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, LoaderCircle, MailWarning } from "lucide-react";

import { AuthErrorBanner } from "@/components/auth/auth-error-banner";
import { useVerifyEmail } from "@/modules/auth/hooks/use-verify-email";
import { useResendVerification } from "@/modules/auth/hooks/use-resend-verification";

export function VerifyEmailStatus() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  if (token) {
    return <TokenVerification token={token} />;
  }
  return <AwaitingVerification />;
}

function TokenVerification({ token }: { token: string }) {
  const { verify, isPending, isSuccess, isError, errorMessage } = useVerifyEmail();

  useEffect(() => {
    verify(token);
    // Only run once, on mount - `verify` and `token` are stable for this component's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isPending) {
    return <StatusCard icon={<LoaderCircle className="size-8 animate-spin text-brand" />} title="Verifying your email…" />;
  }
  if (isSuccess) {
    return (
      <StatusCard
        icon={<CheckCircle2 className="size-8 text-emerald-500" />}
        title="Email verified"
        description="You can now log in and use all of your account's features."
        ctaHref="/auth/login"
        ctaLabel="Go to login"
      />
    );
  }
  if (isError) {
    return (
      <StatusCard
        icon={<MailWarning className="size-8 text-destructive" />}
        title="This link didn't work"
        description={errorMessage ?? "The link may have expired or already been used."}
      >
        <AwaitingVerification compact />
      </StatusCard>
    );
  }
  return null;
}

function AwaitingVerification({ compact = false }: { compact?: boolean }) {
  const { resend, isPending, isSuccess, errorMessage } = useResendVerification();
  const [email, setEmail] = useState("");

  return (
    <div className={compact ? "mt-4" : ""}>
      {!compact && (
        <StatusCard
          icon={<MailWarning className="size-8 text-brand" />}
          title="Check your inbox"
          description="We sent a verification link to your email. Click it to activate your account."
        />
      )}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="your@email.com"
          className="h-10 flex-1 rounded-xl border border-line bg-background px-3 text-sm outline-none focus:border-brand focus:ring-3 focus:ring-brand/20"
        />
        <button
          type="button"
          disabled={isPending || !email.trim()}
          onClick={() => resend(email.trim().toLowerCase())}
          className="h-10 shrink-0 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Sending…" : "Resend link"}
        </button>
      </div>
      {isSuccess ? <p className="mt-2 text-xs text-emerald-600">If that email is registered, a new link is on its way.</p> : null}
      <AuthErrorBanner message={errorMessage} />
    </div>
  );
}

function StatusCard({
  icon,
  title,
  description,
  ctaHref,
  ctaLabel,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  ctaHref?: string;
  ctaLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {icon}
      <h1 className="text-xl font-semibold text-ink">{title}</h1>
      {description ? <p className="text-sm text-ink-muted">{description}</p> : null}
      {ctaHref && ctaLabel ? (
        <a href={ctaHref} className="mt-1 text-sm font-semibold text-brand underline-offset-4 hover:underline">
          {ctaLabel}
        </a>
      ) : null}
      {children}
    </div>
  );
}
