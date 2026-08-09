/**
 * Base URLs for each backend service. No API gateway in this architecture -
 * the client talks to auth-service, event-service, and booking-service
 * directly (see docs/architecture.md and the Render deployment plan).
 */
export const env = {
  authApiUrl: process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:8081",
  eventApiUrl: process.env.NEXT_PUBLIC_EVENT_API_URL ?? "http://localhost:8082",
  bookingApiUrl: process.env.NEXT_PUBLIC_BOOKING_API_URL ?? "http://localhost:8083",
  notificationApiUrl: process.env.NEXT_PUBLIC_NOTIFICATION_API_URL ?? "http://localhost:3003",
} as const;
