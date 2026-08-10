"use client";

import { Grid3X3, List, Search, SlidersHorizontal } from "lucide-react";
import { FilterSelect } from "@/components/common/filter-select";
import { cn } from "@/lib/utils";

export type EventSearchView = "grid" | "list";

interface EventSearchFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  view?: EventSearchView;
  onViewChange?: (value: EventSearchView) => void;
  category?: string;
  categoryOptions?: readonly string[];
  onCategoryChange?: (value: string) => void;
  city?: string;
  cityOptions?: readonly string[];
  onCityChange?: (value: string) => void;
  price?: string;
  priceOptions?: readonly string[];
  onPriceChange?: (value: string) => void;
  sort?: string;
  sortOptions?: readonly string[];
  onSortChange?: (value: string) => void;
  showHeader?: boolean;
  className?: string;
}

export function EventSearchFilters({
  query,
  onQueryChange,
  view,
  onViewChange,
  category,
  categoryOptions,
  onCategoryChange,
  city,
  cityOptions,
  onCityChange,
  price,
  priceOptions,
  onPriceChange,
  sort,
  sortOptions,
  onSortChange,
  showHeader = true,
  className,
}: EventSearchFiltersProps) {
  return (
    <div className={cn("rounded-2xl border border-line bg-canvas p-4 shadow-sm dark:shadow-black/20", className)}>
      {(showHeader || (view && onViewChange)) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {showHeader ? (
            <div className="flex items-center gap-2 text-sm font-bold text-ink">
              <SlidersHorizontal className="size-4 text-brand" />
              Find your next event
            </div>
          ) : (
            <span aria-hidden="true" />
          )}
          {view && onViewChange && (
          <div className="flex rounded-xl border border-line bg-surface p-1" aria-label="View style">
            {[
              { value: "grid" as const, label: "Grid view", icon: Grid3X3 },
              { value: "list" as const, label: "List view", icon: List },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                aria-label={label}
                aria-pressed={view === value}
                onClick={() => onViewChange(value)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg text-ink-muted transition hover:text-ink",
                  view === value && "bg-brand text-brand-foreground shadow-sm hover:text-brand-foreground",
                )}
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>
          )}
        </div>
      )}

      <div className={cn("grid gap-3 lg:grid-cols-[1.3fr_repeat(4,1fr)]", (showHeader || (view && onViewChange)) && "mt-4")}>
        <label className="relative">
          <span className="sr-only">Search events</span>
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by event, venue, or host"
            className="h-11 w-full rounded-xl border border-line bg-surface pl-9 pr-3 text-sm text-ink shadow-sm outline-none placeholder:text-ink-muted transition focus:border-brand focus:ring-3 focus:ring-brand/20"
          />
        </label>

        {category && categoryOptions && onCategoryChange && (
          <FilterSelect label="Category" value={category} options={categoryOptions} onChange={onCategoryChange} />
        )}
        {city && cityOptions && onCityChange && (
          <FilterSelect label="City" value={city} options={cityOptions} onChange={onCityChange} />
        )}
        {price && priceOptions && onPriceChange && (
          <FilterSelect label="Price" value={price} options={priceOptions} onChange={onPriceChange} />
        )}
        {sort && sortOptions && onSortChange && (
          <FilterSelect label="Sort" value={sort} options={sortOptions} onChange={onSortChange} />
        )}
      </div>
    </div>
  );
}
