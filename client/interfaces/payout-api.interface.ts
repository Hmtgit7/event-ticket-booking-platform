/**
 * Shapes returned by booking-service's /bookings/organizer/payouts
 * endpoints. Field names match AvailableBalanceResponse.java /
 * PayoutRequestResponse.java exactly.
 */

export interface AvailableBalanceResponse {
  grossRevenue: number;
  platformCommissionRate: number;
  availableBalance: number;
  currency: string;
}

export type PayoutRequestStatus = "REQUESTED" | "APPROVED" | "REJECTED" | "PAID" | "FAILED";

export interface PayoutRequestResponse {
  id: string;
  organizerId: string;
  amount: number;
  status: PayoutRequestStatus;
  reviewNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface CreatePayoutRequestRequest {
  amount: number;
}
