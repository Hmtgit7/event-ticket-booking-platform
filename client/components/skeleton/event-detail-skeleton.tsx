import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder for `PublicEventDetail` (marketing site event page). */
export function EventDetailSkeleton() {
  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Skeleton className="h-5 w-32" />
      </div>

      <div className="px-3 py-3 sm:px-5 sm:py-5">
        <Skeleton className="h-72 w-full rounded-[30px] sm:h-96" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:px-8">
        <div className="flex flex-col gap-8">
          <div className="rounded-[24px] border border-line bg-canvas p-6 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-64 sm:col-span-2" />
            </div>
            <div className="mt-5 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <div className="rounded-[24px] border border-line bg-canvas p-6 shadow-sm">
            <Skeleton className="mb-3 h-5 w-24" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>

        <div className="rounded-[24px] border border-line bg-canvas p-6 shadow-sm">
          <Skeleton className="mb-4 h-5 w-20" />
          <div className="flex flex-col divide-y divide-line">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex items-center justify-between gap-3 py-3">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-9 w-24 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/** Placeholder for `ExploreEventDetail` (in-dashboard event + booking page). */
export function ExploreEventDetailSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-5 w-32" />

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="flex flex-col gap-5 xl:col-span-2">
          <Skeleton className="h-64 w-full rounded-2xl sm:h-80" />

          <div className="rounded-2xl border border-line bg-surface p-6">
            <Skeleton className="h-7 w-2/3" />
            <div className="mt-3 flex flex-wrap gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6">
            <Skeleton className="mb-3 h-5 w-24" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <Skeleton className="mb-4 h-5 w-20" />
            <div className="flex flex-col divide-y divide-line">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="flex items-center justify-between gap-3 py-3">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-9 w-24 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
