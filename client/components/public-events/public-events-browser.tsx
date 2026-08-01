"use client";

import { useMemo, useState } from "react";
import { PublicEventCard } from "@/components/public-events/public-event-card";
import { PublicEventFilters } from "@/components/public-events/public-event-filters";
import { PUBLIC_EVENTS } from "@/constants/public-events";

export function PublicEventsBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("All cities");
  const [price, setPrice] = useState("Any price");
  const [sort, setSort] = useState("Soonest");

  const cities = useMemo(
    () => Array.from(new Set(PUBLIC_EVENTS.map((event) => event.location.city))).sort(),
    [],
  );

  const visibleEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return PUBLIC_EVENTS.filter((event) => {
      const searchable = [event.title, event.location.venue, event.location.city, event.host]
        .join(" ")
        .toLowerCase();
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
      const matchesCategory = category === "All" || event.category === category;
      const matchesCity = city === "All cities" || event.location.city === city;
      const matchesPrice = priceMatches(event.price, price);

      return matchesQuery && matchesCategory && matchesCity && matchesPrice;
    }).sort((a, b) => {
      if (sort === "Lowest price") return toPrice(a.price) - toPrice(b.price);
      if (sort === "Most popular") return b.ticketsSoldPct - a.ticketsSoldPct;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [category, city, price, query, sort]);

  return (
    <section className="border-t border-line bg-surface py-10 sm:py-14 dark:bg-[#17130e]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <PublicEventFilters
          category={category}
          city={city}
          price={price}
          query={query}
          sort={sort}
          cities={cities}
          onCategoryChange={setCategory}
          onCityChange={setCity}
          onPriceChange={setPrice}
          onQueryChange={setQuery}
          onSortChange={setSort}
        />

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink-muted">{visibleEvents.length} public events found</p>
          <button type="button" onClick={resetFilters} className="text-sm font-bold text-brand">
            Reset filters
          </button>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {visibleEvents.map((event) => (
            <PublicEventCard key={event.id} event={event} />
          ))}
        </div>

        {visibleEvents.length === 0 && (
          <div className="mt-6 rounded-[24px] border border-line bg-canvas p-10 text-center shadow-sm dark:bg-[#211b14]">
            <h2 className="text-xl font-bold text-ink">No events match those filters.</h2>
            <p className="mt-2 text-sm text-ink-muted">Try a broader category, city, or price range.</p>
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

function priceMatches(price: number | "free", filter: string) {
  const value = toPrice(price);
  if (filter === "Free") return price === "free";
  if (filter === "Under $25") return value < 25;
  if (filter === "$25 to $75") return value >= 25 && value <= 75;
  if (filter === "$75+") return value >= 75;
  return true;
}

function toPrice(price: number | "free") {
  return price === "free" ? 0 : price;
}
