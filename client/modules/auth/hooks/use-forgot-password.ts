import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import { getApiErrorMessage } from "@/modules/auth/utils/get-api-error-message";

/** Backend is deliberately silent about whether the email exists - success always looks the same. */
export function useForgotPassword() {
  const mutation = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });

  return {
    submit: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    errorMessage: mutation.error ? getApiErrorMessage(mutation.error) : null,
  };
}
