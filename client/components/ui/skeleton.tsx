import { cn } from "@/lib/utils";

/**
 * Base shimmer block. Every skeleton in `components/skeleton/*` is composed
 * from this primitive so the pulse animation and color stay consistent
 * everywhere. Uses `bg-ink/10` (not `bg-muted`) because `--muted` resolves
 * to `--color-surface`, which is too close to the page background in this
 * theme to read as a distinct shimmer.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-ink/10 dark:bg-ink/15", className)}
      {...props}
    />
  );
}

export { Skeleton };
