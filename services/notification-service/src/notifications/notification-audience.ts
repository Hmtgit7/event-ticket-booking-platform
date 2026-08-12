/** Who a notification is for - a plain string, not a TS enum, matching NotificationType's rationale: adding ADMIN later is just a new string constant. */
export const NotificationAudience = {
  USER: 'USER',
  ORGANIZER: 'ORGANIZER',
} as const;

export type NotificationAudience = (typeof NotificationAudience)[keyof typeof NotificationAudience];
