"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

import { SectionTitle } from "@/components/user-dashboard/widgets/section-title";
import { EventBrowseCard } from "@/components/user-dashboard/explore/event-browse-card";
import { PUBLIC_EVENTS } from "@/constants/public-events";

/**
 * Explore Events page — searchable, filterable grid of all available
 * events. Uses the same PUBLIC_EVENTS constant as the marketing page.
 */
export function ExploreContainer() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PUBLIC_EVENTS;
    return PUBLIC_EVENTS.filter((event) =>
      [event.title, event.category, event.location.city, event.host]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query]);

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
      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface px-5 py-12 text-center text-sm text-ink-muted">
          No events match &quot;{query}&quot;.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((event) => (
            <EventBrowseCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
