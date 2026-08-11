import { Skeleton } from "@/components/ui/skeleton";

/**
 * Generic content-area skeleton for a dashboard segment's `loading.tsx`.
 * Not shaped to any specific page — used only as the transitional fallback
 * during client-side navigation before the target page's own (more
 * accurate) skeleton takes over. Deliberately simple.
 */
export function GenericContentSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-56" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}
