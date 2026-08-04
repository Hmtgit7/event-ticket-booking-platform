"use client";

import { SectionTitle } from "@/components/user-dashboard/widgets/section-title";
import { SavedEventCard } from "@/components/user-dashboard/saved/saved-event-card";
import { DUMMY_SAVED_EVENTS } from "@/constants/user-dashboard-data";

/**
 * Saved Events (Wishlist) page container.
 */
export function SavedContainer() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-line bg-surface p-5">
        <SectionTitle eyebrow="Wishlist" title="Saved events" />
        <p className="mt-1 text-sm text-ink-muted">
          Events you&apos;ve bookmarked for later.
        </p>
      </div>

      {DUMMY_SAVED_EVENTS.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface px-5 py-12 text-center text-sm text-ink-muted">
          You haven&apos;t saved any events yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {DUMMY_SAVED_EVENTS.map((event) => (
            <SavedEventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
