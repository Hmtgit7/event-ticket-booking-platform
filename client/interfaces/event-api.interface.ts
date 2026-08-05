/**
 * Shapes returned by / sent to event-service. Field names match the backend
 * DTOs exactly (see EventResponse.java, CreateEventRequest.java, etc.) so no
 * mapping layer is needed between fetch and UI.
 */

export type EventLifecycleStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";

export interface TicketTypePayload {
  name: string;
  price: number;
  quantityTotal: number;
  salesStart?: string | null;
  salesEnd?: string | null;
}

export interface TicketTypeResponse {
  id: string;
  name: string;
  price: number;
  quantityTotal: number;
  quantityAvailable: number;
  salesStart: string | null;
  salesEnd: string | null;
}

export interface CreateEventPayload {
  title: string;
  category: string;
  description: string;
  venueName: string;
  address: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  /** ISO-8601 instant, e.g. new Date(...).toISOString() */
  startAt: string;
  endAt: string;
  bannerImageUrl?: string | null;
  bannerPublicId?: string | null;
  ticketTypes: TicketTypePayload[];
  publishImmediately: boolean;
}

export type UpdateEventPayload = Omit<CreateEventPayload, "ticketTypes" | "publishImmediately">;

export interface EventResponse {
  id: string;
  organizerId: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  venueName: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  startAt: string;
  endAt: string;
  bannerImageUrl: string | null;
  bannerPublicId: string | null;
  status: EventLifecycleStatus;
  publishedAt: string | null;
  ticketTypes: TicketTypeResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface EventSummaryResponse {
  id: string;
  title: string;
  slug: string;
  category: string;
  venueName: string;
  city: string;
  startAt: string;
  endAt: string;
  bannerImageUrl: string | null;
  status: EventLifecycleStatus;
  fromPrice: number | null;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PublicEventQuery {
  category?: string;
  city?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}
