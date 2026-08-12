"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, MailWarning } from "lucide-react";

import { AuthErrorBanner } from "@/components/auth/auth-error-banner";
import { AnimatedLogo } from "@/components/common/animated-logo";
import { useVerifyEmail } from "@/modules/auth/hooks/use-verify-email";
import { useResendVerification } from "@/modules/auth/hooks/use-resend-verification";

export function VerifyEmailStatus() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  useEffect(() => {
    // Belt-and-suspenders only - proxy.ts's guardVerifyEmailPage already
    // redirects any token-less visit to /auth/login before this component
    // ever mounts. "Check your inbox" lives on the signup form itself now
    // (see SignupForm/AwaitingVerification), not here, so a token-less render
    // of this page should never legitimately happen.
    if (!token) {
      router.replace("/auth/login");
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return <TokenVerification token={token} />;
}

function TokenVerification({ token }: { token: string }) {
  const { verify, isPending, isSuccess, isError, errorMessage } = useVerifyEmail();

  useEffect(() => {
    verify(token);
    // Only run once, on mount - `verify` and `token` are stable for this component's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isPending) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <AnimatedLogo className="size-14" />
        <h1 className="text-xl font-semibold text-ink">Verifying your email…</h1>
      </div>
    );
  }
  if (isSuccess) {
    return (
      <StatusCard
        icon={<CheckCircle2 className="size-8 text-emerald-500" />}
        title="Email verified"
        description="Taking you to your dashboard…"
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

export function AwaitingVerification({ compact = false, defaultEmail = "" }: { compact?: boolean; defaultEmail?: string }) {
  const { resend, isPending, isSuccess, errorMessage } = useResendVerification();
  const [email, setEmail] = useState(defaultEmail);

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
