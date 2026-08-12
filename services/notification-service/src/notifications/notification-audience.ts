/** Who a notification is for - a plain string, not a TS enum, matching NotificationType's rationale. */
export const NotificationAudience = {
  USER: 'USER',
  ORGANIZER: 'ORGANIZER',
  ADMIN: 'ADMIN',
} as const;

export type NotificationAudience = (typeof NotificationAudience)[keyof typeof NotificationAudience];
