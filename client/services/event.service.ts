import { eventApiClient } from "@/lib/api-client";
import type {
  CreateEventPayload,
  EventResponse,
  EventSummaryResponse,
  PageResponse,
  PublicEventQuery,
  TicketTypePayload,
  TicketTypeResponse,
  UpdateEventPayload,
} from "@/interfaces/event-api.interface";

function toQueryString(query: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/** Thin wrapper over event-service's REST API. No business logic here - that lives in the containers. */
export const eventService = {
  // ── organizer ──
  createEvent: (payload: CreateEventPayload) => eventApiClient.post<EventResponse>("/events", payload),

  updateEvent: (id: string, payload: UpdateEventPayload) =>
    eventApiClient.put<EventResponse>(`/events/${id}`, payload),

  addTicketType: (eventId: string, payload: TicketTypePayload) =>
    eventApiClient.post<TicketTypeResponse>(`/events/${eventId}/ticket-types`, payload),

  updateTicketType: (eventId: string, ticketTypeId: string, payload: TicketTypePayload) =>
    eventApiClient.put<TicketTypeResponse>(`/events/${eventId}/ticket-types/${ticketTypeId}`, payload),

  deleteTicketType: (eventId: string, ticketTypeId: string) =>
    eventApiClient.delete<void>(`/events/${eventId}/ticket-types/${ticketTypeId}`),

  publishEvent: (id: string) => eventApiClient.post<EventResponse>(`/events/${id}/publish`),

  cancelEvent: (id: string) => eventApiClient.post<EventResponse>(`/events/${id}/cancel`),

  myEvents: (page = 0, size = 12) =>
    eventApiClient.get<PageResponse<EventSummaryResponse>>(`/events/mine${toQueryString({ page, size })}`),

  getMyEvent: (id: string) => eventApiClient.get<EventResponse>(`/events/${id}`),

  // ── public ──
  publicEvents: (query: PublicEventQuery = {}) =>
    eventApiClient.get<PageResponse<EventSummaryResponse>>(`/events/public${toQueryString({ ...query })}`),

  publicEventBySlug: (slug: string) => eventApiClient.get<EventResponse>(`/events/public/${slug}`),
};
