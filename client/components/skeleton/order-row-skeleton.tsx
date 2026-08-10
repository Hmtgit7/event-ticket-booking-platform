import { Skeleton } from "@/components/ui/skeleton";

/**
 * Placeholder for `OrderRow` (orders/bookings list). One row at a time —
 * compose with a `.map()` in the consumer, same as the real rows.
 */
export function OrderRowSkeleton() {
  return (
    <div className="grid gap-3 rounded-2xl border border-line bg-background p-4 md:grid-cols-[1fr_auto] md:items-center">
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3.5 w-64" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-7 w-20 rounded-lg" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export function OrderListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, index) => (
        <OrderRowSkeleton key={index} />
      ))}
    </div>
  );
}
