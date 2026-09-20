"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { COUNTRIES, findCountryByCode } from "@/constants/countries";
import { countryCodeToFlagEmoji } from "@/lib/country-flag";
import { useLocation } from "@/hooks/use-location";

/**
 * Flag + country name pill, the pattern seen in most global apps'
 * topbars (Booking.com, Airbnb, etc.) - shows the resolved country (see
 * LocationResolver for how that gets set) and lets the person override
 * it manually. Flags are rendered via Unicode, not image assets - see
 * lib/country-flag.ts. The country list is a small static import
 * (constants/countries.ts), so filtering is instant client-side, no
 * debounced API call needed here.
 */
export function CountrySwitcher() {
  const { country, setCountry } = useLocation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = findCountryByCode(country);

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return COUNTRIES;
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(trimmed));
  }, [query]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function selectCountry(code: string) {
    setOpen(false);
    setQuery("");
    setCountry(code);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Change country"
        aria-expanded={open}
        className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-sm font-semibold text-ink transition hover:border-brand"
      >
        <span className="text-base leading-none">{countryCodeToFlagEmoji(selected?.code ?? "")}</span>
        <span className="hidden sm:inline">{selected?.name ?? "Select country"}</span>
        <ChevronDown className="size-3.5 text-ink-muted" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-64 rounded-2xl border border-line bg-surface p-2 shadow-lg">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search country"
            autoFocus
            className="mb-2 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
          />
          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-center text-sm text-ink-muted">No matches.</p>
            )}
            {filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => selectCountry(c.code)}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-ink transition hover:bg-canvas"
              >
                <span className="text-base leading-none">{countryCodeToFlagEmoji(c.code)}</span>
                <span className="truncate">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
