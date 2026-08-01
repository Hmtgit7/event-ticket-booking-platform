import { Search, SlidersHorizontal } from "lucide-react";
import { EVENT_CATEGORIES, PRICE_FILTERS, SORT_OPTIONS } from "@/constants/public-events";

interface PublicEventFiltersProps {
  category: string;
  city: string;
  price: string;
  query: string;
  sort: string;
  cities: string[];
  onCategoryChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onQueryChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export function PublicEventFilters(props: PublicEventFiltersProps) {
  return (
    <div className="rounded-[24px] border border-line bg-canvas p-4 shadow-sm dark:bg-[#211b14] dark:shadow-black/20">
      <div className="flex items-center gap-2 text-sm font-bold text-ink">
        <SlidersHorizontal className="size-4 text-brand" />
        Find your next event
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={props.query}
            onChange={(event) => props.onQueryChange(event.target.value)}
            placeholder="Search by event, venue, or host"
            className="h-11 w-full rounded-xl border border-line bg-surface pl-9 pr-3 text-sm outline-none focus:border-brand dark:bg-[#17130e]"
          />
        </label>

        <Select label="Category" value={props.category} options={[...EVENT_CATEGORIES]} onChange={props.onCategoryChange} />
        <Select label="City" value={props.city} options={["All cities", ...props.cities]} onChange={props.onCityChange} />
        <Select label="Price" value={props.price} options={[...PRICE_FILTERS]} onChange={props.onPriceChange} />
        <Select label="Sort" value={props.sort} options={[...SORT_OPTIONS]} onChange={props.onSortChange} />
      </div>
    </div>
  );
}

function Select({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm font-medium text-ink outline-none focus:border-brand dark:bg-[#17130e]"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
