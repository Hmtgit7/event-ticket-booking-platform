"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/common/error-fallback";
import { ErrorStateIllustration } from "@/icons/empty-state-icons";
import "../styles/globals.css";

/**
 * Root-layout error boundary. Only fires if `app/layout.tsx` itself throws
 * (a provider crashing, a font failing, etc.) — Next.js unmounts the entire
 * tree including the root layout, so this file has to supply its own
 * `<html>`/`<body>` and can't assume ThemeProvider or any other provider
 * from `layout.tsx` ran successfully. Kept deliberately minimal.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console -- surfaced until Sentry/monitoring lands (see Chunk 4)
    console.error("Root layout error boundary caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <ErrorFallback
          icon={<ErrorStateIllustration className="size-32" />}
          title="Something went wrong"
          description="The app hit an unexpected error and couldn't load. Try reloading — if it keeps happening, let us know."
          onRetry={reset}
          retryLabel="Reload"
          digest={error.digest}
        />
      </body>
    </html>
  );
}
