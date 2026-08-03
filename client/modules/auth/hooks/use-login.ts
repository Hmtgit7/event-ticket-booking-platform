import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { resolvePostLoginRedirect } from "@/modules/auth/utils/post-login-redirect";
import { getApiErrorMessage } from "@/modules/auth/utils/get-api-error-message";
import type { LoginPayload } from "@/interfaces/auth.interface";

export function useLogin() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const mutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (auth) => {
      setSession(auth);
      router.push(resolvePostLoginRedirect(auth.roles));
    },
  });

  return {
    login: mutation.mutate,
    isPending: mutation.isPending,
    errorMessage: mutation.error ? getApiErrorMessage(mutation.error) : null,
  };
}
