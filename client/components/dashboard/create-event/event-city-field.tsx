"use client";

import { useEffect, useRef, useState } from "react";
import { inputCls } from "./form-field";
import { useCitySearch } from "@/hooks/use-city-search";
import { countryCodeToFlagEmoji } from "@/lib/country-flag";
import type { CitySuggestionResponse } from "@/interfaces/geo.interface";

interface EventCityFieldProps {
  value: string;
  onSelect: (city: CitySuggestionResponse) => void;
}

/**
 * Replaces a plain free-text city input with a /geo/cities-backed
 * autocomplete (see chunk 2's CityController) - picking a suggestion
 * auto-fills city, countryCode, timezone, and lat/lng on the draft in one
 * go (see create-event-container's handleCitySelect), instead of the
 * organizer typing all of those by hand. Typing without selecting a
 * suggestion is still allowed (draft.city just won't have a matching
 * countryCode/timezone until they pick one - validated server-side).
 */
export function EventCityField({ value, onSelect }: EventCityFieldProps) {
  const { query, setQuery, results, loading, reset } = useCitySearch();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleChange(next: string) {
    setTyped(next);
    setQuery(next);
    setOpen(true);
  }

  function handleSelect(city: CitySuggestionResponse) {
    const label = `${city.city}, ${city.country}`;
    setTyped(label);
    setOpen(false);
    reset();
    onSelect(city);
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        id="city"
        type="text"
        placeholder="e.g. Colombo"
        value={typed}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => query.trim().length >= 2 && setOpen(true)}
        className={inputCls}
        autoComplete="off"
      />

      {open && (loading || results.length > 0) && (
        <div className="absolute left-0 top-full z-40 mt-1 w-full max-h-64 overflow-y-auto rounded-xl border border-line bg-surface shadow-lg">
          {loading && <p className="px-3 py-3 text-sm text-ink-muted">Searching…</p>}
          {!loading &&
            results.map((city) => (
              <button
                key={`${city.city}-${city.countryCode}-${city.latitude}`}
                type="button"
                onClick={() => handleSelect(city)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink transition hover:bg-canvas"
              >
                <span className="text-base leading-none">{countryCodeToFlagEmoji(city.countryCode)}</span>
                <span className="truncate">
                  {city.city}
                  {city.adminName ? `, ${city.adminName}` : ""}, {city.country}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
