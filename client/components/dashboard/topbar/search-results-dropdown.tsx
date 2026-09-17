"use client";

import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { CATEGORY_VISUAL, type EventCategory } from "@/enums/event-category.enum";
import type { EventSummaryResponse } from "@/interfaces/event-api.interface";
import { formatPrice } from "@/lib/events";

interface SearchResultsDropdownProps {
  query: string;
  results: EventSummaryResponse[];
  loading: boolean;
  onSelect: () => void;
}

/**
 * Tile-format keyword search results shown under the topbar search bar.
 * Results already match on title, city, venue, or description (see
 * useTopbarSearch / event-service's keywordContains). Clicking a tile takes
 * the customer straight to that event's description/booking page.
 */
export function SearchResultsDropdown({ query, results, loading, onSelect }: SearchResultsDropdownProps) {
  const router = useRouter();

  if (query.trim().length < 2) return null;

  function goToEvent(slug: string) {
    onSelect();
    router.push(`/user/dashboard/explore/${slug}`);
  }

  return (
    <div className="absolute left-0 top-full z-40 mt-2 max-h-96 w-full overflow-y-auto rounded-2xl border border-line bg-surface p-2 shadow-lg">
      {loading && <p className="px-3 py-4 text-center text-sm text-ink-muted">Searching…</p>}

      {!loading && results.length === 0 && (
        <p className="px-3 py-4 text-center text-sm text-ink-muted">No events match &ldquo;{query}&rdquo;.</p>
      )}

      {!loading &&
        results.map((event) => {
          const visual = CATEGORY_VISUAL[event.category as EventCategory];
          return (
            <button
              key={event.id}
              type="button"
              onClick={() => goToEvent(event.slug)}
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-canvas"
            >
              <span
                className="size-12 shrink-0 rounded-lg bg-cover bg-center"
                style={{
                  background: event.bannerImageUrl
                    ? `url(${event.bannerImageUrl}) center/cover`
                    : `linear-gradient(160deg, ${visual?.from ?? "#242424"}, ${visual?.to ?? "#0a0a0a"})`,
                }}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink">{event.title}</span>
                <span className="flex items-center gap-1 text-xs text-ink-muted">
                  <MapPin className="size-3 shrink-0" />
                  <span className="truncate">{event.city}</span>
                </span>
              </span>
              <span className="shrink-0 text-xs font-bold text-brand">{formatPrice(event.fromPrice)}</span>
            </button>
          );
        })}
    </div>
  );
}
