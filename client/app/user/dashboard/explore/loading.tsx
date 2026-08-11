import { EventCardSkeleton } from "@/components/skeleton";

export default function ExploreLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  );
}
