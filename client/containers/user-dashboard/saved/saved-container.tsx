"use client";

import { SectionTitle } from "@/components/user-dashboard/widgets/section-title";
import { SavedEventCard } from "@/components/user-dashboard/saved/saved-event-card";
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
        <p className="rounded-2xl border border-line bg-surface px-5 py-12 text-center text-sm text-ink-muted">
          You haven&apos;t saved any events yet. Tap the heart icon on any event to save it here.
        </p>
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
