import type { EventCategory } from "@/enums/event-category.enum";

export interface TicketTierDraft {
  /** Client-only key for React list rendering / editing - not sent to the backend. */
  key: string;
  name: string;
  price: number;
  quantityTotal: number | undefined;
}

export function emptyTier(): TicketTierDraft {
  return { key: crypto.randomUUID(), name: "", price: 0, quantityTotal: undefined };
}

/**
 * Shape of the in-progress create-event form draft.
 * Each step patches a subset of this interface.
 */
export interface CreateEventDraft {
  // Step 1 — Basic info
  title: string;
  category: EventCategory | "";
  description: string;

  // Step 2 — Date & location
  date: string;
  time: string;
  endTime: string;
  venue: string;
  address: string;
  city: string;
  lat?: number;
  lng?: number;

  // Step 3 — Tickets & media
  ticketTiers: TicketTierDraft[];
  bannerUrl?: string;
  bannerPublicId?: string;
}

export const EMPTY_DRAFT: CreateEventDraft = {
  title: "",
  category: "",
  description: "",
  date: "",
  time: "",
  endTime: "",
  venue: "",
  address: "",
  city: "",
  ticketTiers: [emptyTier()],
};

export type CreateEventStep = 1 | 2 | 3;

export const STEP_LABELS: Record<CreateEventStep, string> = {
  1: "Basic Info",
  2: "Date & Location",
  3: "Tickets & Media",
};
