/**
 * Shapes returned by payment-service's /organizer/payout-account endpoints.
 * Field names match PayoutAccountResponse.java / SubmitPayoutAccountRequest.java
 * exactly. Never includes the full bank account number - only the last 4 digits.
 */

export type PayoutAccountStatus = "PENDING" | "ACTIVE" | "FAILED";

export interface PayoutAccountResponse {
  accountHolderName: string;
  bankAccountLast4: string;
  ifscCode: string;
  status: PayoutAccountStatus;
  failureReason: string | null;
}

export interface SubmitPayoutAccountRequest {
  accountHolderName: string;
  bankAccountNumber: string;
  ifscCode: string;
}
