/**
 * Base URLs for each backend service - no API gateway in this architecture,
 * mirrors client/lib/env.ts exactly. Expo only inlines vars prefixed with
 * EXPO_PUBLIC_ into the JS bundle at build time (unprefixed vars are
 * server-only and invisible here, same tradeoff as NEXT_PUBLIC_ on web).
 */
export const env = {
  authApiUrl: process.env.EXPO_PUBLIC_AUTH_API_URL ?? "http://localhost:8081",
  eventApiUrl: process.env.EXPO_PUBLIC_EVENT_API_URL ?? "http://localhost:8082",
  bookingApiUrl: process.env.EXPO_PUBLIC_BOOKING_API_URL ?? "http://localhost:8083",
  paymentApiUrl: process.env.EXPO_PUBLIC_PAYMENT_API_URL ?? "http://localhost:8084",
  notificationApiUrl: process.env.EXPO_PUBLIC_NOTIFICATION_API_URL ?? "http://localhost:3003",
} as const;
