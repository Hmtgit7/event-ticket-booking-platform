import { paymentApiClient, ApiError } from "@/lib/api-client";
import type { PayoutAccountResponse, SubmitPayoutAccountRequest } from "@/interfaces/payout-account-api.interface";

/** Thin wrapper over payment-service's /organizer/payout-account REST API. */
export const payoutAccountService = {
  submit: (payload: SubmitPayoutAccountRequest) =>
    paymentApiClient.post<PayoutAccountResponse>("/organizer/payout-account", payload),

  /** Returns null if the organizer hasn't set up a payout account yet (404), instead of throwing - that's an expected first-visit state, not an error. */
  getMyPayoutAccount: async (): Promise<PayoutAccountResponse | null> => {
    try {
      return await paymentApiClient.get<PayoutAccountResponse>("/organizer/payout-account");
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return null;
      throw err;
    }
  },
};
