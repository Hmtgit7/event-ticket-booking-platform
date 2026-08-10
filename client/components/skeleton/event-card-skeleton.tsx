import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface EventCardSkeletonProps {
  variant?: "grid" | "list";
}

/**
 * Placeholder for `PublicEventCard`. Mirrors its exact structure (banner,
 * title/price row, meta grid, footer) so the layout doesn't jump when real
 * data replaces it.
 */
export function EventCardSkeleton({ variant = "grid" }: EventCardSkeletonProps) {
  const isList = variant === "list";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-line bg-canvas shadow-sm",
        isList && "grid md:grid-cols-[320px_1fr]",
      )}
    >
      <Skeleton className={cn("h-56 w-full rounded-none", isList && "md:h-full md:min-h-64")} />

      <div className={cn("flex flex-col gap-4 p-5", isList && "justify-between")}>
        <div className="grid gap-2 sm:grid-cols-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-48 sm:col-span-2" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-28 rounded-xl" />
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Grid/list of `EventCardSkeleton`, sized to match `PublicEventsBrowser`'s
 * own grid classes so swapping loading -> loaded doesn't reflow.
 */
export function EventListSkeleton({
  count = 6,
  variant = "grid",
}: {
  count?: number;
  variant?: "grid" | "list";
}) {
  return (
    <div className={cn("grid gap-5", variant === "grid" ? "lg:grid-cols-3" : "grid-cols-1")}>
      {Array.from({ length: count }, (_, index) => (
        <EventCardSkeleton key={index} variant={variant} />
      ))}
    </div>
  );
}
