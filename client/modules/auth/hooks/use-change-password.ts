import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import { getApiErrorMessage } from "@/modules/auth/utils/get-api-error-message";
import type { ChangePasswordPayload } from "@/interfaces/auth.interface";

/** Settings-page password change/set. See ChangePasswordCard for the current-password-optional UI logic. */
export function useChangePassword() {
  const mutation = useMutation({
    mutationFn: (payload: ChangePasswordPayload) => authService.changePassword(payload),
  });

  return {
    submit: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
    errorMessage: mutation.error ? getApiErrorMessage(mutation.error) : null,
  };
}
