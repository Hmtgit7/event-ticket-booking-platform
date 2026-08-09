import { bookingApiClient } from "@/lib/api-client";
import type { PageResponse } from "@/interfaces/event-api.interface";
import type { RechargeWalletPayload, WalletResponse, WalletTransactionResponse } from "@/interfaces/wallet-api.interface";

/** Thin wrapper over booking-service's /wallet REST API. No business logic here - that lives in the containers. */
export const walletService = {
  getWallet: () => bookingApiClient.get<WalletResponse>("/wallet"),

  recharge: (payload: RechargeWalletPayload) => bookingApiClient.post<WalletResponse>("/wallet/recharge", payload),

  getTransactions: (page = 0, size = 20) =>
    bookingApiClient.get<PageResponse<WalletTransactionResponse>>(`/wallet/transactions?page=${page}&size=${size}`),
};
