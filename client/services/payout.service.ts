import { bookingApiClient } from "@/lib/api-client";
import type { PageResponse } from "@/interfaces/event-api.interface";
import type {
  AvailableBalanceResponse,
  CreatePayoutRequestRequest,
  PayoutRequestResponse,
} from "@/interfaces/payout-api.interface";

/** Thin wrapper over booking-service's /bookings/organizer/payouts REST API. */
export const payoutService = {
  getAvailableBalance: () => bookingApiClient.get<AvailableBalanceResponse>("/bookings/organizer/payouts/available-balance"),

  requestPayout: (payload: CreatePayoutRequestRequest) =>
    bookingApiClient.post<PayoutRequestResponse>("/bookings/organizer/payouts", payload),

  getMyPayoutRequests: (page = 0, size = 10) =>
    bookingApiClient.get<PageResponse<PayoutRequestResponse>>(`/bookings/organizer/payouts?page=${page}&size=${size}`),
};
