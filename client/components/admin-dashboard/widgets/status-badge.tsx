import { cn } from "@/lib/utils";

type BadgeVariant = "green" | "red" | "yellow" | "muted" | "blue";

interface StatusBadgeProps {
  label: string;
  variant: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  green:  "bg-positive/10 text-positive border-positive/25",
  red:    "bg-brand/10 text-brand border-brand/25",
  yellow: "bg-yellow-500/10 text-yellow-600 border-yellow-400/25 dark:text-yellow-400",
  muted:  "bg-ink/5 text-ink-muted border-line",
  blue:   "bg-blue-500/10 text-blue-600 border-blue-400/25 dark:text-blue-400",
};

/**
 * Small pill badge for statuses across the admin dashboard
 * (event status, user status, ticket status, support priority, etc.).
 */
export function StatusBadge({ label, variant }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold",
        variantClasses[variant],
      )}
    >
      {label}
    </span>
  );
}
