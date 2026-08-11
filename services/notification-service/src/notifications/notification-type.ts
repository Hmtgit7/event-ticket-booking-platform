/** Notification type tags - a plain string, not a TS enum, so a new type (e.g. BOOKING_CANCELLED) is just a new string constant, never a change to existing code that reads/writes this column. */
export const NotificationType = {
  BOOKING_CONFIRMED: 'BOOKING_CONFIRMED',
  BOOKING_RECEIVED: 'BOOKING_RECEIVED',
} as const;

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];
