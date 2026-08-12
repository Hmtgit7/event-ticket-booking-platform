import { notificationApiClient } from "@/lib/api-client";
import type { PageResponse } from "@/interfaces/event-api.interface";
import type { NotificationResponse } from "@/interfaces/notification-api.interface";

export type NotificationAudience = "USER" | "ORGANIZER" | "ADMIN";

/**
 * Thin wrapper over notification-service's REST API. No business logic here - that lives in the containers.
 *
 * audience is required on every read: a dual-role account has one JWT/userId but two isolated inboxes
 * (USER vs ORGANIZER). Omitting it isn't a safe default - that's exactly how the two inboxes ended up
 * merged before this was added, so the backend rejects requests without it rather than assuming one side.
 */
export const notificationService = {
  myNotifications: (audience: NotificationAudience, page = 0, size = 20) =>
    notificationApiClient.get<PageResponse<NotificationResponse>>(
      `/notifications/mine?audience=${audience}&page=${page}&size=${size}`
    ),

  unreadCount: (audience: NotificationAudience) =>
    notificationApiClient.get<{ count: number }>(`/notifications/unread-count?audience=${audience}`),

  markRead: (id: string) => notificationApiClient.patch<{ success: true }>(`/notifications/${id}/read`),
};
