import { EventCardSkeleton } from "@/components/skeleton";

export default function OrganizerEventsLoading() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  );
}
