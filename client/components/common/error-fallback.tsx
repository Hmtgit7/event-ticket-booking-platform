"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/common/brand-logo";
import { cn } from "@/lib/utils";

interface ErrorFallbackProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  showHomeLink?: boolean;
  showLogo?: boolean;
  digest?: string;
  className?: string;
  /** "fullscreen" (default) for app/error.tsx and not-found.tsx. "inline"
   * drops the min-h-screen + logo so it fits inside a dashboard shell that
   * already has its own nav. */
  variant?: "fullscreen" | "inline";
}

/**
 * Shared fallback used by `app/error.tsx`, `app/global-error.tsx`,
 * `app/not-found.tsx`, and the per-dashboard scoped error boundaries. Keeps
 * every error surface visually consistent instead of each hand-rolling its
 * own layout.
 */
export function ErrorFallback({
  title,
  description,
  icon,
  onRetry,
  retryLabel = "Try again",
  showHomeLink = true,
  showLogo,
  digest,
  className,
  variant = "fullscreen",
}: ErrorFallbackProps) {
  const isInline = variant === "inline";
  const shouldShowLogo = showLogo ?? !isInline;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 px-6 text-center",
        isInline ? "rounded-2xl border border-line bg-surface py-16" : "min-h-screen bg-canvas py-16",
        className,
      )}
    >
      {shouldShowLogo ? <BrandLogo /> : null}

      {icon}

      <div className="flex max-w-md flex-col items-center gap-2">
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        <p className="text-sm text-ink-muted">{description}</p>
        {digest ? (
          <p className="mt-1 rounded-lg bg-surface px-2.5 py-1 font-mono text-xs text-ink-muted">Ref: {digest}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry ? (
          <Button onClick={onRetry} className="bg-brand text-brand-foreground hover:bg-brand/90">
            {retryLabel}
          </Button>
        ) : null}
        {showHomeLink ? (
          <Link
            href="/"
            className="rounded-xl border border-line bg-background px-4 py-2 text-sm font-bold text-ink transition hover:border-brand hover:text-brand"
          >
            Back to home
          </Link>
        ) : null}
      </div>

      <p className="text-xs text-ink-muted">
        Still stuck? Email us at{" "}
        <a href="mailto:support@grabmyticket.com" className="font-semibold text-brand hover:underline">
          support@grabmyticket.com
        </a>
      </p>
    </div>
  );
}
