import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminPlatformStat } from "@/constants/admin-dashboard-data";

interface AdminStatCardProps {
  stat: AdminPlatformStat;
}

/**
 * Platform-level stat card used in the admin overview grid.
 * Shows label, value, and a delta badge (green = up, red = down).
 */
export function AdminStatCard({ stat }: AdminStatCardProps) {
  const isPositive = stat.deltaPct >= 0;
  const isNeutral  = stat.deltaPct === 0;

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
      <p className="text-sm text-ink-muted">{stat.label}</p>

      <div className="flex items-end justify-between gap-2">
        <p className="text-3xl font-black text-ink">{stat.value}</p>
        {!isNeutral && (
          <span
            className={cn(
              "mb-0.5 flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
              isPositive
                ? "bg-positive/10 text-positive"
                : "bg-brand/10 text-brand",
            )}
          >
            {isPositive ? (
              <ArrowUp className="size-3" />
            ) : (
              <ArrowDown className="size-3" />
            )}
            {Math.abs(stat.deltaPct)}%
          </span>
        )}
      </div>

      <p className="text-xs text-ink-muted">{stat.comparedTo}</p>
    </article>
  );
}
