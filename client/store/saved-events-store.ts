import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { EventSummaryResponse } from "@/interfaces/event-api.interface";

interface SavedEventsState {
  savedEvents: EventSummaryResponse[];
  isSaved: (eventId: string) => boolean;
  toggleSaved: (event: EventSummaryResponse) => void;
  removeSaved: (eventId: string) => void;
}

/** No-op storage so the persist middleware doesn't crash during SSR - localStorage doesn't exist in Node. */
const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

/**
 * A user's bookmarked events (the heart icon on event cards). Stored
 * client-side only - there's no "saved events" endpoint on any service,
 * and a wishlist doesn't need server-side durability to be useful. Keeps
 * the full EventSummaryResponse so the Saved Events page can render
 * without an extra round trip, at the cost of the snapshot going stale
 * if the event's price/date changes after saving.
 */
export const useSavedEventsStore = create<SavedEventsState>()(
  persist(
    (set, get) => ({
      savedEvents: [],

      isSaved: (eventId) => get().savedEvents.some((e) => e.id === eventId),

      toggleSaved: (event) =>
        set((state) => {
          const exists = state.savedEvents.some((e) => e.id === event.id);
          return {
            savedEvents: exists
              ? state.savedEvents.filter((e) => e.id !== event.id)
              : [...state.savedEvents, event],
          };
        }),

      removeSaved: (eventId) =>
        set((state) => ({ savedEvents: state.savedEvents.filter((e) => e.id !== eventId) })),
    }),
    {
      name: "grabmyticket-saved-events",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? window.localStorage : noopStorage)),
    },
  ),
);
