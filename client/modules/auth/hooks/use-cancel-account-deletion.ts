import { useMutation, useQueryClient } from "@tanstack/react-query";

import { accountDeletionService } from "@/services/account-deletion.service";
import { getApiErrorMessage } from "@/modules/auth/utils/get-api-error-message";

/** Self-service cancel, any time during the grace period - see PendingDeletionBanner. */
export function useCancelAccountDeletion() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => accountDeletionService.cancelDeletion(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  return {
    submit: mutation.mutate,
    isPending: mutation.isPending,
    errorMessage: mutation.error ? getApiErrorMessage(mutation.error) : null,
  };
}
