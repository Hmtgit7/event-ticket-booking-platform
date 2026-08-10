import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder for `StatCard` (dashboard KPI tiles). */
export function StatCardSkeleton() {
  return (
    <div className="flex flex-1 items-start gap-3 rounded-3xl bg-surface p-5 shadow-sm">
      <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

/** Row of `StatCardSkeleton`s — matches how dashboards lay out `StatCard`. */
export function DashboardStatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-4">
      {Array.from({ length: count }, (_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  );
}
