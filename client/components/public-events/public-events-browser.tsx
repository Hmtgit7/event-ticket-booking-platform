"use client";

import { useEffect, useMemo, useState } from "react";
import { PublicEventCard } from "@/components/public-events/public-event-card";
import { PublicEventFilters } from "@/components/public-events/public-event-filters";
import { eventService } from "@/services/event.service";
import type { EventSummaryResponse } from "@/interfaces/event-api.interface";

const PAGE_SIZE = 12;

export function PublicEventsBrowser() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("All cities");
  const [price, setPrice] = useState("Any price");
  const [sort, setSort] = useState("Soonest");

  const [events, setEvents] = useState<EventSummaryResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [knownCities, setKnownCities] = useState<string[]>([]);

  // Debounce the free-text search so we're not hitting the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  // Re-fetch page 0 whenever a server-side filter changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true); // eslint-disable-line react-hooks/set-state-in-effect
    setError(null);
    eventService
      .publicEvents({
        category: category === "All" ? undefined : category,
        city: city === "All cities" ? undefined : city,
        search: debouncedQuery || undefined,
        page: 0,
        size: PAGE_SIZE,
      })
      .then((result) => {
        if (cancelled) return;
        setEvents(result.items);
        setPage(0);
        setTotalPages(result.totalPages);
        setKnownCities((prev) => Array.from(new Set([...prev, ...result.items.map((e) => e.city)])).sort());
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
  }, [category, city, debouncedQuery]);

  function loadMore() {
    const nextPage = page + 1;
    setLoading(true);
    eventService
      .publicEvents({
        category: category === "All" ? undefined : category,
        city: city === "All cities" ? undefined : city,
        search: debouncedQuery || undefined,
        page: nextPage,
        size: PAGE_SIZE,
      })
      .then((result) => {
        setEvents((prev) => [...prev, ...result.items]);
        setPage(nextPage);
        setKnownCities((prev) => Array.from(new Set([...prev, ...result.items.map((e) => e.city)])).sort());
      })
      .catch(() => setError("Couldn't load more events."))
      .finally(() => setLoading(false));
  }

  // Price bucket + "most popular"/"lowest price" sort aren't server-side filters - applied here on the loaded page(s).
  const visibleEvents = useMemo(() => {
    return events
      .filter((event) => priceMatches(event.fromPrice, price))
      .sort((a, b) => {
        if (sort === "Lowest price") return (a.fromPrice ?? 0) - (b.fromPrice ?? 0);
        if (sort === "Most popular") return b.totalSold - a.totalSold;
        return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
      });
  }, [events, price, sort]);

  return (
    <section className="border-t border-line bg-surface py-10 sm:py-14 dark:bg-[#17130e]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <PublicEventFilters
          category={category}
          city={city}
          price={price}
          query={query}
          sort={sort}
          cities={knownCities}
          onCategoryChange={setCategory}
          onCityChange={setCity}
          onPriceChange={setPrice}
          onQueryChange={setQuery}
          onSortChange={setSort}
        />

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink-muted">
            {loading && events.length === 0 ? "Loading…" : `${visibleEvents.length} public events found`}
          </p>
          <button type="button" onClick={resetFilters} className="text-sm font-bold text-brand">
            Reset filters
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-[24px] border border-line bg-canvas p-6 text-center text-sm text-brand shadow-sm dark:bg-[#211b14]">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {visibleEvents.map((event) => (
            <PublicEventCard key={event.id} event={event} />
          ))}
        </div>

        {!loading && !error && visibleEvents.length === 0 && (
          <div className="mt-6 rounded-[24px] border border-line bg-canvas p-10 text-center shadow-sm dark:bg-[#211b14]">
            <h2 className="text-xl font-bold text-ink">No events match those filters.</h2>
            <p className="mt-2 text-sm text-ink-muted">Try a broader category, city, or price range.</p>
          </div>
        )}

        {page + 1 < totalPages && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={loading}
              className="rounded-xl border border-line bg-canvas px-6 py-2.5 text-sm font-bold text-ink shadow-sm transition hover:border-brand hover:text-brand disabled:opacity-50 dark:bg-[#211b14]"
            >
              {loading ? "Loading…" : "Load more"}
            </button>
          </div>
        )}
      </div>
    </section>
  );

  function resetFilters() {
    setQuery("");
    setCategory("All");
    setCity("All cities");
    setPrice("Any price");
    setSort("Soonest");
  }
}

function priceMatches(fromPrice: number | null, filter: string) {
  const value = fromPrice ?? 0;
  if (filter === "Free") return value === 0;
  if (filter === "Under $25") return value < 25;
  if (filter === "$25 to $75") return value >= 25 && value <= 75;
  if (filter === "$75+") return value >= 75;
  return true;
}
