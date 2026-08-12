import { AnimatedLogo } from "@/components/common/animated-logo";

interface FullPageLoaderProps {
  /** Shown under the brand name. Keep it short - this is a moment, not a message. */
  message?: string;
}

/**
 * Full-screen branded loader — used for top-level app/section boot
 * (root `app/loading.tsx`, route guards deciding whether a session is
 * valid, and anywhere navigating into a whole new area of the app with no
 * content on screen yet to skeletonize). Once real content exists on screen
 * (dashboards, lists, details), skeletons are the right tool instead — this
 * is deliberately not reused inside dashboards.
 */
export function FullPageLoader({ message = "Setting up the app for you…" }: FullPageLoaderProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-canvas px-6 text-center">
      <AnimatedLogo className="size-16" />
      <div className="flex flex-col items-center gap-1.5">
        <span className="font-[family-name:var(--font-playfair)] text-lg font-bold italic leading-none tracking-wide text-ink">
          GrabMyTicket
        </span>
        <p className="text-sm text-ink-muted">{message}</p>
      </div>
    </div>
  );
}
