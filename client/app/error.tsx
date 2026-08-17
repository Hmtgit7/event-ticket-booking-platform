"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/common/error-fallback";
import { ErrorStateIllustration } from "@/icons/empty-state-icons";

/**
 * Route-segment error boundary. Next.js renders this in place of the
 * segment that threw, while the root layout (nav, providers) stays intact.
 * Must be a client component and must accept `reset` to offer retry.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error boundary caught:", error);
  }, [error]);

  return (
    <ErrorFallback
      icon={<ErrorStateIllustration className="size-32" />}
      title="Something went wrong"
      description="We hit an unexpected error loading this page. Try again, and if it keeps happening, let us know."
      onRetry={reset}
      digest={error.digest}
    />
  );
}
