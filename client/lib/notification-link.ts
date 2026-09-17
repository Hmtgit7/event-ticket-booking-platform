import type { NotificationAudience } from "@/services/notification.service";
import type { NotificationResponse } from "@/interfaces/notification-api.interface";

/**
 * Where a notification's "View" action should navigate. Only a couple of
 * notification types carry a deep-linkable destination today - anything
 * else (or a missing referenceId) falls back to the inbox page itself,
 * which every audience has.
 */
export function getNotificationLink(notification: NotificationResponse, audience: NotificationAudience, fallbackHref: string): string {
  if (notification.referenceId) {
    if (notification.type === "BOOKING_CONFIRMED" && audience === "USER") {
      return `/user/dashboard/orders/${notification.referenceId}`;
    }
  }
  return fallbackHref;
}
