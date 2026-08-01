import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percent: number;
  showLabel?: boolean;
  className?: string;
}

/** Thin capsule progress track used for "tickets sold" indicators on
 * event cards and the event detail page. */
export function ProgressBar({ percent, showLabel = true, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line/60">
        <div className="h-full rounded-full bg-ink transition-all" style={{ width: `${clamped}%` }} />
      </div>
      {showLabel && <span className="text-xs font-medium text-ink-muted">{clamped}%</span>}
    </div>
  );
}
