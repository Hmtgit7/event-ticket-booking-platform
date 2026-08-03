import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import { getApiErrorMessage } from "@/modules/auth/utils/get-api-error-message";

export function useResendVerification() {
  const mutation = useMutation({
    mutationFn: (email: string) => authService.resendVerification(email),
  });

  return {
    resend: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    // Backend is deliberately silent about whether the email exists - a
    // 429 (rate limited) is the only error message worth surfacing distinctly.
    errorMessage: mutation.error ? getApiErrorMessage(mutation.error) : null,
  };
}
