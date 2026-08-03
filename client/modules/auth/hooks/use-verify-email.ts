import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import { getApiErrorMessage } from "@/modules/auth/utils/get-api-error-message";

export function useVerifyEmail() {
  const mutation = useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
  });

  return {
    verify: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    errorMessage: mutation.error ? getApiErrorMessage(mutation.error) : null,
  };
}
