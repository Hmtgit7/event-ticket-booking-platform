import { ArrowDown, ArrowUp } from "lucide-react";
import type { StatCardData } from "@/interfaces/dashboard.interface";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, icon: Icon, deltaPct, comparedTo }: StatCardData) {
  const isPositive = deltaPct >= 0;

  return (
    <div className="flex flex-1 items-start gap-3 rounded-3xl bg-surface p-5 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-ink">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-ink-muted">{label}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-ink">{value}</span>
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              isPositive ? "text-positive" : "text-brand",
            )}
          >
            {isPositive ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
            {Math.abs(deltaPct)}%
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-ink-muted">{comparedTo}</p>
      </div>
    </div>
  );
}
