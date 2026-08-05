import { EventCategory } from "@/enums/event-category.enum";

export const EVENT_CATEGORIES = ["All", ...Object.values(EventCategory)] as const;

export const PRICE_FILTERS = ["Any price", "Free", "Under $25", "$25 to $75", "$75+"] as const;

export const SORT_OPTIONS = ["Soonest", "Lowest price", "Most popular"] as const;
