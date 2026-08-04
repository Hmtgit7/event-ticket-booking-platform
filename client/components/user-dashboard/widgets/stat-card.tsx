import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  meta: string;
  /** Optional extra class for the card wrapper */
  className?: string;
  /** Optional accent color for the meta text */
  metaVariant?: "positive" | "muted" | "brand";
}

const metaClasses: Record<NonNullable<StatCardProps["metaVariant"]>, string> = {
  positive: "text-positive",
  muted: "text-ink-muted",
  brand: "text-brand",
};

/**
 * Small summary card used in the user dashboard overview grid.
 * Displays a label, a large numeric value, and a short descriptive note.
 */
export function StatCard({
  label,
  value,
  meta,
  className,
  metaVariant = "positive",
}: StatCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-line bg-surface p-5",
        className,
      )}
    >
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="mt-2 text-3xl font-black text-ink">{value}</p>
      <p className={cn("mt-1.5 text-xs font-medium", metaClasses[metaVariant])}>
        {meta}
      </p>
    </article>
  );
}
