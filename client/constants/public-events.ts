import { EventCategory } from "@/enums/event-category.enum";
import { MOCK_EVENTS } from "@/constants/mock-events";

export const EVENT_CATEGORIES = ["All", ...Object.values(EventCategory)] as const;

export const PRICE_FILTERS = ["Any price", "Free", "Under $25", "$25 to $75", "$75+"] as const;

export const SORT_OPTIONS = ["Soonest", "Lowest price", "Most popular"] as const;

const EVENT_IMAGES: Record<string, string> = {
  "food-exhibition":
    "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80",
  "ai-make-us-better":
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
  "fashion-empire":
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
  "how-to-camp":
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
  "hip-hop-thugs":
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
  "balanced-diet":
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
  "code-with-us":
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
  "adventure-hiking":
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
};

const EVENT_TAGLINES: Record<string, string> = {
  "food-exhibition": "Tastings, chef demos, and local makers in one lively hall.",
  "ai-make-us-better": "A practical technology day for builders, leaders, and curious teams.",
  "fashion-empire": "A runway-forward showcase with emerging designers and seasonal looks.",
  "how-to-camp": "Hands-on outdoor skills for first-time campers and weekend explorers.",
  "hip-hop-thugs": "A high-energy New Year's Eve concert with live guests and big sound.",
  "balanced-diet": "A fresh morning session on nutrition, habits, and sustainable routines.",
  "code-with-us": "A free community coding day with mentors and project rooms.",
  "adventure-hiking": "A guided sunrise trail experience with summit breakfast included.",
};

export const PUBLIC_EVENTS = MOCK_EVENTS.map((event, index) => ({
  ...event,
  image: EVENT_IMAGES[event.id],
  tagline: EVENT_TAGLINES[event.id],
  host: ["GrabMyTicket Live", "City Makers", "Pulse Collective", "Open Stage"][index % 4],
  seatsLeft: Math.max(24, 420 - index * 37),
}));

export type PublicEvent = (typeof PUBLIC_EVENTS)[number];
