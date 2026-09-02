/**
 * Shapes returned by event-service's public endpoints. Field names match the
 * backend DTOs exactly, same convention as client/interfaces/event-api.interface.ts.
 * Only the public/browsing surface is ported here - organizer-side payloads
 * (CreateEventPayload etc.) stay web-only for now, see mobile/README.md.
 */

export type EventLifecycleStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";

export interface TicketTypeResponse {
  id: string;
  name: string;
  price: number;
  quantityTotal: number;
  quantityAvailable: number;
  salesStart: string | null;
  salesEnd: string | null;
}

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
  totalCapacity: number;
  totalSold: number;
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
