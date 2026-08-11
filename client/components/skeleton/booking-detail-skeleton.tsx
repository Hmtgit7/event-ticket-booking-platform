import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder for `BookingDetailContainer` (view-ticket page). */
export function BookingDetailSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-5 w-28" />

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex h-40 items-end bg-ink/5 p-6">
          <Skeleton className="h-7 w-2/3" />
        </div>

        <div className="flex flex-col gap-5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-40" />
            </div>
            <Skeleton className="h-7 w-24 rounded-lg" />
          </div>

          <div className="grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-line pt-5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Placeholder for `EventDetail` (organizer's own event-management page). */
export function OrganizerEventDetailSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-5 w-32" />

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="flex flex-col gap-5 xl:col-span-2">
          <Skeleton className="h-72 w-full rounded-3xl" />

          <div className="rounded-3xl bg-surface p-6 shadow-sm">
            <Skeleton className="h-7 w-2/3" />
            <div className="mt-3 flex flex-wrap gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <Skeleton className="h-2.5 w-full max-w-xs rounded-full" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-28 rounded-xl" />
                <Skeleton className="h-10 w-24 rounded-xl" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-surface p-6 shadow-sm">
            <Skeleton className="mb-4 h-5 w-28" />
            <div className="flex flex-col divide-y divide-line">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="flex items-center justify-between gap-3 py-3">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-3xl bg-surface p-6 text-center shadow-sm">
            <Skeleton className="mx-auto h-5 w-28" />
            <Skeleton className="mx-auto mt-2 h-3 w-32" />
            <div className="flex justify-center py-4">
              <Skeleton className="size-[220px] rounded-full" />
            </div>
          </div>

          <div className="rounded-3xl bg-surface p-6 shadow-sm">
            <Skeleton className="mb-3 h-5 w-24" />
            <Skeleton className="mb-3 h-4 w-40" />
            <Skeleton className="h-52 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
