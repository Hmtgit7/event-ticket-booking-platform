"use client";

import { useEffect, useMemo, useState } from "react";

import { EventSearchFilters } from "@/components/events/event-search-filters";
import { EventBrowseCard } from "@/components/user-dashboard/explore/event-browse-card";
import { EventCardSkeleton } from "@/components/skeleton";
import { EVENT_CATEGORIES, PRICE_FILTERS, SORT_OPTIONS } from "@/constants/public-events";
import { eventService } from "@/services/event.service";
import type { EventSummaryResponse } from "@/interfaces/event-api.interface";

export function ExploreContainer() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("All cities");
  const [price, setPrice] = useState("Any price");
  const [sort, setSort] = useState("Soonest");
  const [events, setEvents] = useState<EventSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [knownCities, setKnownCities] = useState<string[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    eventService
      .publicEvents({
        category: category === "All" ? undefined : category,
        city: city === "All cities" ? undefined : city,
        search: debouncedQuery || undefined,
        size: 24,
      })
      .then((result) => {
        if (cancelled) return;
        setEvents(result.items);
        setError(null);
        setKnownCities((prev) => Array.from(new Set([...prev, ...result.items.map((event) => event.city)])).sort());
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

  const filtered = useMemo(() => {
    return events
      .filter((event) => priceMatches(event.fromPrice, price))
      .sort((a, b) => {
        if (sort === "Lowest price") return (a.fromPrice ?? 0) - (b.fromPrice ?? 0);
        if (sort === "Most popular") return b.totalSold - a.totalSold;
        return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
      });
  }, [events, price, sort]);

  return (
    <div className="flex flex-col gap-6">
      <EventSearchFilters
        category={category}
        categoryOptions={EVENT_CATEGORIES}
        city={city}
        cityOptions={["All cities", ...knownCities]}
        price={price}
        priceOptions={PRICE_FILTERS}
        query={query}
        sort={sort}
        sortOptions={SORT_OPTIONS}
        showHeader={false}
        onCategoryChange={setCategory}
        onCityChange={setCity}
        onPriceChange={setPrice}
        onQueryChange={setQuery}
        onSortChange={setSort}
      />

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      )}

      {error && !loading && (
        <p className="rounded-2xl border border-line bg-surface px-5 py-12 text-center text-sm text-brand">{error}</p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="rounded-2xl border border-line bg-surface px-5 py-12 text-center text-sm text-ink-muted">
          No events match those filters.
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

function priceMatches(fromPrice: number | null, filter: string) {
  const value = fromPrice ?? 0;
  if (filter === "Free") return value === 0;
  if (filter === "Under $25") return value < 25;
  if (filter === "$25 to $75") return value >= 25 && value <= 75;
  if (filter === "$75+") return value >= 75;
  return true;
}
