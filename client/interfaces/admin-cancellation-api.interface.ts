/**
 * Shapes for booking-service's /admin/cancellations endpoints. Field names
 * match CancellationRequestResponse.java exactly.
 */

export type CancellationRequestStatus = "REQUESTED" | "APPROVED" | "REJECTED";

export interface AdminCancellationRequestResponse {
  id: string;
  bookingId: string;
  reason: string;
  status: CancellationRequestStatus;
  refundAmount: number | null;
  reviewNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
}
