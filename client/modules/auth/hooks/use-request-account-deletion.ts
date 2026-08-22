import { useMutation, useQueryClient } from "@tanstack/react-query";

import { accountDeletionService } from "@/services/account-deletion.service";
import { getApiErrorMessage } from "@/modules/auth/utils/get-api-error-message";
import { getDeletionEligibilityFromError } from "@/modules/auth/utils/get-deletion-eligibility-from-error";
import type { RequestAccountDeletionPayload } from "@/interfaces/account-deletion.interface";

/** Submits the actual deletion request. On a 409 (still blocked, or warnings not acknowledged), the caller should re-render the blocker/warning list via getDeletionEligibilityFromError rather than showing a flat error banner. */
export function useRequestAccountDeletion() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: RequestAccountDeletionPayload) => accountDeletionService.requestDeletion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  return {
    submit: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    eligibilityFromError: mutation.error ? getDeletionEligibilityFromError(mutation.error) : null,
    errorMessage: mutation.error ? getApiErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}
