import { EventSearchFilters } from "@/components/events/event-search-filters";
import { EVENT_CATEGORIES, PRICE_FILTERS, SORT_OPTIONS } from "@/constants/public-events";

interface PublicEventFiltersProps {
  category: string;
  city: string;
  price: string;
  query: string;
  sort: string;
  view: "grid" | "list";
  cities: string[];
  onCategoryChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onQueryChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onViewChange: (value: "grid" | "list") => void;
}

export function PublicEventFilters(props: PublicEventFiltersProps) {
  return (
    <EventSearchFilters
      category={props.category}
      categoryOptions={EVENT_CATEGORIES}
      city={props.city}
      cityOptions={["All cities", ...props.cities]}
      price={props.price}
      priceOptions={PRICE_FILTERS}
      query={props.query}
      sort={props.sort}
      sortOptions={SORT_OPTIONS}
      view={props.view}
      onCategoryChange={props.onCategoryChange}
      onCityChange={props.onCityChange}
      onPriceChange={props.onPriceChange}
      onQueryChange={props.onQueryChange}
      onSortChange={props.onSortChange}
      onViewChange={props.onViewChange}
    />
  );
}
