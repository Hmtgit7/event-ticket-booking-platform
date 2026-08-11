import { EventListSkeleton } from "@/components/skeleton";

export default function PublicEventsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <EventListSkeleton count={6} />
    </div>
  );
}
