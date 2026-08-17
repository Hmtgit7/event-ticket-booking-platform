import { bookingApiClient } from "@/lib/api-client";
import type { PageResponse } from "@/interfaces/event-api.interface";
import type { PayoutRequestResponse } from "@/interfaces/payout-api.interface";
import type { AdminCancellationRequestResponse } from "@/interfaces/admin-cancellation-api.interface";

/**
 * Admin review queues - both live in booking-service, both reuse the same
 * bearer token as every other authenticated request (admin login populates
 * the same auth store as organizer/user login, just with a ROLE_ADMIN JWT -
 * no separate "admin API client" needed).
 */
export const adminApprovalsService = {
  getPendingPayouts: (page = 0, size = 20) =>
    bookingApiClient.get<PageResponse<PayoutRequestResponse>>(`/admin/payouts/pending?page=${page}&size=${size}`),

  approvePayout: (id: string) => bookingApiClient.patch<PayoutRequestResponse>(`/admin/payouts/${id}/approve`, {}),

  rejectPayout: (id: string, note: string) =>
    bookingApiClient.patch<PayoutRequestResponse>(`/admin/payouts/${id}/reject`, { note }),

  getPendingCancellations: (page = 0, size = 20) =>
    bookingApiClient.get<PageResponse<AdminCancellationRequestResponse>>(`/admin/cancellations/pending?page=${page}&size=${size}`),

  approveCancellation: (id: string) =>
    bookingApiClient.patch<AdminCancellationRequestResponse>(`/admin/cancellations/${id}/approve`, {}),

  rejectCancellation: (id: string, note: string) =>
    bookingApiClient.patch<AdminCancellationRequestResponse>(`/admin/cancellations/${id}/reject`, { note }),
};
