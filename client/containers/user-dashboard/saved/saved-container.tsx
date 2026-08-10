"use client";

import { SectionTitle } from "@/components/user-dashboard/widgets/section-title";
import { SavedEventCard } from "@/components/user-dashboard/saved/saved-event-card";
import { EmptyState } from "@/components/common/empty-state";
import { NoSavedIllustration } from "@/icons/empty-state-icons";
import { useSavedEventsStore } from "@/store/saved-events-store";

/**
 * Saved Events (Wishlist) page container. Reads from the client-side
 * saved-events store (see store/saved-events-store.ts) - the heart icon
 * on any event card writes here.
 */
export function SavedContainer() {
  const savedEvents = useSavedEventsStore((state) => state.savedEvents);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-line bg-surface p-5">
        <SectionTitle eyebrow="Wishlist" title="Saved events" />
        <p className="mt-1 text-sm text-ink-muted">
          Events you&apos;ve bookmarked for later.
        </p>
      </div>

      {savedEvents.length === 0 ? (
        <EmptyState
          icon={<NoSavedIllustration className="size-28" />}
          title="No saved events yet"
          description="Tap the heart icon on any event to bookmark it here."
          action={{ label: "Explore events", href: "/user/dashboard/explore" }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {savedEvents.map((event) => (
            <SavedEventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
