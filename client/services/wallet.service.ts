import { bookingApiClient } from "@/lib/api-client";
import type { PageResponse } from "@/interfaces/event-api.interface";
import type { WalletResponse, WalletTransactionResponse } from "@/interfaces/wallet-api.interface";

/**
 * Thin wrapper over booking-service's /wallet REST API. Read-only - recharge
 * now goes through payment-service (see services/payment.service.ts +
 * useRazorpayCheckout); this service's balance only changes once
 * payment-service's webhook confirms a Razorpay payment and publishes it
 * over Kafka.
 */
export const walletService = {
  getWallet: () => bookingApiClient.get<WalletResponse>("/wallet"),

  getTransactions: (page = 0, size = 20) =>
    bookingApiClient.get<PageResponse<WalletTransactionResponse>>(`/wallet/transactions?page=${page}&size=${size}`),
};
