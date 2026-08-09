import { notificationApiClient } from "@/lib/api-client";
import type { PageResponse } from "@/interfaces/event-api.interface";
import type { NotificationResponse } from "@/interfaces/notification-api.interface";

/** Thin wrapper over notification-service's REST API. No business logic here - that lives in the containers. */
export const notificationService = {
  myNotifications: (page = 0, size = 20) =>
    notificationApiClient.get<PageResponse<NotificationResponse>>(`/notifications/mine?page=${page}&size=${size}`),

  unreadCount: () => notificationApiClient.get<{ count: number }>("/notifications/unread-count"),

  markRead: (id: string) => notificationApiClient.patch<{ success: true }>(`/notifications/${id}/read`),
};
