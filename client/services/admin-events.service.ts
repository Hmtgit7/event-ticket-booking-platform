import { eventApiClient } from "@/lib/api-client";
import type { PageResponse } from "@/interfaces/event-api.interface";
import type { AdminEventStatus, AdminEventSummary } from "@/interfaces/admin-event-api.interface";

/** Only the fields this UI actually reads back - the real endpoints return the full EventResponse shape (slug, description, ticketTypes, etc.), not the list-view summary. */
interface ModerationResult {
  status: AdminEventStatus;
  moderationReason: string | null;
}

/** Thin wrapper over event-service's /admin/events REST API. */
export const adminEventsService = {
  listEvents: (status: AdminEventStatus | null, page = 0, size = 20) =>
    eventApiClient.get<PageResponse<AdminEventSummary>>(
      `/admin/events?page=${page}&size=${size}${status ? `&status=${status}` : ""}`,
    ),

  flagEvent: (id: string, reason: string) => eventApiClient.patch<ModerationResult>(`/admin/events/${id}/flag`, { reason }),

  unflagEvent: (id: string) => eventApiClient.patch<ModerationResult>(`/admin/events/${id}/unflag`, {}),

  removeEvent: (id: string, reason: string) => eventApiClient.patch<ModerationResult>(`/admin/events/${id}/remove`, { reason }),

  restoreEvent: (id: string) => eventApiClient.patch<ModerationResult>(`/admin/events/${id}/restore`, {}),
};
