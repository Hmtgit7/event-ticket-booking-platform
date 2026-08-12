import { GrabMyTicketLogoMark } from "@/icons/grabmyticket-logo";
import { cn } from "@/lib/utils";

interface AnimatedLogoProps {
  className?: string;
  markClassName?: string;
}

/**
 * Branded loading mark - a soft pulsing halo behind the logomark, plus a
 * gentle breathing scale on the mark itself. Used anywhere the app needs to
 * say "something is happening" without falling back to a generic spinner.
 * Pure CSS (no JS), so it's safe inside server-rendered fallbacks like
 * `app/loading.tsx` and route guards.
 */
export function AnimatedLogo({ className, markClassName }: AnimatedLogoProps) {
  return (
    <div className={cn("relative flex size-14 items-center justify-center", className)} role="status">
      <span
        className="absolute inline-flex size-full animate-ping rounded-full bg-brand/20"
        style={{ animationDuration: "1.8s" }}
        aria-hidden="true"
      />
      <span className="absolute inline-flex size-[82%] animate-pulse rounded-full bg-brand/10" aria-hidden="true" />
      <GrabMyTicketLogoMark
        className={cn(
          "relative size-full animate-[logo-breathe_2.4s_ease-in-out_infinite] drop-shadow-sm",
          markClassName,
        )}
      />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
