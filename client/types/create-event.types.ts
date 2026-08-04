import type { EventCategory } from "@/enums/event-category.enum";

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
  venue: string;
  city: string;
  lat?: number;
  lng?: number;

  // Step 3 — Tickets & media
  ticketType: "free" | "paid";
  price?: number;
  capacity?: number;
  bannerUrl?: string;
  bannerPublicId?: string;
}

export const EMPTY_DRAFT: CreateEventDraft = {
  title: "",
  category: "",
  description: "",
  date: "",
  time: "",
  venue: "",
  city: "",
  ticketType: "free",
};

export type CreateEventStep = 1 | 2 | 3;

export const STEP_LABELS: Record<CreateEventStep, string> = {
  1: "Basic Info",
  2: "Date & Location",
  3: "Tickets & Media",
};
