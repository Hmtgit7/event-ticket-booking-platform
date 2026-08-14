/**
 * Shapes returned by booking-service's wallet endpoints. Field names match
 * WalletResponse.java / WalletTransactionResponse.java exactly.
 */

export interface WalletResponse {
  id: string;
  balance: number;
  currency: string;
  updatedAt: string;
}

export type TransactionType = "CREDIT" | "DEBIT";
export type TransactionReason = "RECHARGE" | "BOOKING_PAYMENT" | "BOOKING_REFUND";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface WalletTransactionResponse {
  id: string;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  reason: TransactionReason;
  status: TransactionStatus;
  description: string;
  referenceId: string | null;
  createdAt: string;
}
