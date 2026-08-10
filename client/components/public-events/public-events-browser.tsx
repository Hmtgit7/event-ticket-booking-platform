"use client";

import { useEffect, useMemo, useState } from "react";
import { PublicEventCard } from "@/components/public-events/public-event-card";
import { PublicEventFilters } from "@/components/public-events/public-event-filters";
import { EventListSkeleton } from "@/components/skeleton";
import { eventService } from "@/services/event.service";
import type { EventSummaryResponse } from "@/interfaces/event-api.interface";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

export function PublicEventsBrowser() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("All cities");
  const [price, setPrice] = useState("Any price");
  const [sort, setSort] = useState("Soonest");
  const [view, setView] = useState<"grid" | "list">("grid");

  const [events, setEvents] = useState<EventSummaryResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [knownCities, setKnownCities] = useState<string[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
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
        setError(null);
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
    <section className="border-t border-line bg-surface py-8 sm:py-10">
      <div className="mx-auto flex h-[calc(100vh-5rem)] w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="sticky top-16 z-30 -mx-4 border-b border-line bg-surface/95 px-4 pb-4 pt-2 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <PublicEventFilters
            category={category}
            city={city}
            price={price}
            query={query}
            sort={sort}
            view={view}
            cities={knownCities}
            onCategoryChange={setCategory}
            onCityChange={setCity}
            onPriceChange={setPrice}
            onQueryChange={setQuery}
            onSortChange={setSort}
            onViewChange={setView}
          />

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-ink-muted">
              {loading && events.length === 0 ? "Finding events…" : `${visibleEvents.length} public events found`}
            </p>
            <button type="button" onClick={resetFilters} className="text-sm font-bold text-brand">
              Reset filters
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pb-6 pt-6">
          {error && (
            <div className="rounded-2xl border border-line bg-canvas p-6 text-center text-sm text-brand shadow-sm">
              {error}
            </div>
          )}

          {loading && events.length === 0 ? (
            <EventListSkeleton count={6} variant={view} />
          ) : (
            <div className={cn("grid gap-5", view === "grid" ? "lg:grid-cols-3" : "grid-cols-1")}>
              {visibleEvents.map((event) => (
                <PublicEventCard key={event.id} event={event} variant={view} />
              ))}
            </div>
          )}

          {!loading && !error && visibleEvents.length === 0 && (
            <div className="mt-6 rounded-2xl border border-line bg-canvas p-10 text-center shadow-sm">
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
                className="rounded-xl border border-line bg-canvas px-6 py-2.5 text-sm font-bold text-ink shadow-sm transition hover:border-brand hover:text-brand disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </div>
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
