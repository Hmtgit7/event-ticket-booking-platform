import { eventApiClient } from "@/lib/api-client";
import type {
  EventResponse,
  EventSummaryResponse,
  PageResponse,
  PublicEventQuery,
} from "@/interfaces/event-api.interface";

function toQueryString(query: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Thin wrapper over event-service's public REST API. Mirrors
 * client/services/event.service.ts - organizer-side mutations (create,
 * publish, ticket types) stay web-only for now, see mobile/README.md backlog.
 */
export const eventService = {
  publicEvents: (query: PublicEventQuery = {}) =>
    eventApiClient.get<PageResponse<EventSummaryResponse>>(`/events/public${toQueryString({ ...query })}`),

  publicEventBySlug: (slug: string) => eventApiClient.get<EventResponse>(`/events/public/${slug}`),
};
