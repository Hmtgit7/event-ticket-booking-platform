import { authApiClient } from "@/lib/api-client";
import type {
  AccountDeletionStatusResponse,
  DeletionEligibilityResponse,
  DeletionScope,
  RequestAccountDeletionPayload,
} from "@/interfaces/account-deletion.interface";
import type { MessageResponse } from "@/interfaces/auth.interface";

/** Thin wrapper over auth-service's account-deletion endpoints (Phase 9). No business logic here - that lives in the hooks. */
export const accountDeletionService = {
  checkEligibility: (scope: DeletionScope) =>
    authApiClient.get<DeletionEligibilityResponse>(
      `/auth/me/deletion-eligibility?scope=${scope}`,
    ),

  requestDeletion: (payload: RequestAccountDeletionPayload) =>
    authApiClient.post<AccountDeletionStatusResponse>("/auth/me/deletion-request", payload),

  cancelDeletion: () =>
    authApiClient.delete<MessageResponse>("/auth/me/deletion-request"),

  getStatus: () => authApiClient.get<AccountDeletionStatusResponse>("/auth/me/deletion-request"),
};
