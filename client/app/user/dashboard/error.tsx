"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/common/error-fallback";
import { ErrorStateIllustration } from "@/icons/empty-state-icons";

/** Scoped to /user/dashboard — keeps UserDashboardShell mounted on error. */
export default function UserDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("User dashboard error boundary caught:", error);
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
