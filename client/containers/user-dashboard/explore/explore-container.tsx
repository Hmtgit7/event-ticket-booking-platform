"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { SectionTitle } from "@/components/user-dashboard/widgets/section-title";
import { EventBrowseCard } from "@/components/user-dashboard/explore/event-browse-card";
import { eventService } from "@/services/event.service";
import type { EventSummaryResponse } from "@/interfaces/event-api.interface";

/**
 * Explore Events page — searchable grid of all publicly published events,
 * for a signed-in user browsing inside the dashboard (same data as the
 * public marketing /events page, just inside the authenticated shell so
 * "Book now" can go straight to checkout without leaving the app).
 */
export function ExploreContainer() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [events, setEvents] = useState<EventSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    eventService
      .publicEvents({ search: debouncedQuery || undefined, size: 24 })
      .then((result) => {
        if (!cancelled) setEvents(result.items);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load events. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const filtered = useMemo(() => events, [events]);

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header + search ── */}
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 md:flex-row md:items-end md:justify-between">
        <SectionTitle eyebrow="Discover" title="Find your next event" />
        <label className="relative block w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, city, category…"
            className="h-11 w-full rounded-xl border border-line bg-background pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted outline-none transition focus:border-brand"
          />
        </label>
      </div>

      {/* ── Results ── */}
      {loading && (
        <p className="rounded-2xl border border-line bg-surface px-5 py-12 text-center text-sm text-ink-muted">
          Loading events…
        </p>
      )}

      {error && !loading && (
        <p className="rounded-2xl border border-line bg-surface px-5 py-12 text-center text-sm text-brand">{error}</p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="rounded-2xl border border-line bg-surface px-5 py-12 text-center text-sm text-ink-muted">
          No events match &quot;{query}&quot;.
        </p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((event) => (
            <EventBrowseCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
