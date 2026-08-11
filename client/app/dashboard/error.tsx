"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/common/error-fallback";
import { ErrorStateIllustration } from "@/icons/empty-state-icons";

/**
 * Scoped to /dashboard (organizer). Sits alongside `layout.tsx` in the same
 * segment, so `DashboardShell` (sidebar/topbar) stays mounted and only the
 * content area shows the error — no full-page wipe.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console -- surfaced until Sentry/monitoring lands
    console.error("Organizer dashboard error boundary caught:", error);
  }, [error]);

  return (
    <ErrorFallback
      variant="inline"
      icon={<ErrorStateIllustration className="size-28" />}
      title="Couldn't load this page"
      description="Something went wrong loading this section. Try again, or head back to your overview."
      onRetry={reset}
      digest={error.digest}
      showHomeLink={false}
    />
  );
}
