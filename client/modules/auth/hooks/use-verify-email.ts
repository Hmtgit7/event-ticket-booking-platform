import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { resolvePostLoginRedirect } from "@/modules/auth/utils/post-login-redirect";
import { getApiErrorMessage } from "@/modules/auth/utils/get-api-error-message";

/** How long the green-tick success state stays on screen before auto-redirecting. */
const SUCCESS_REDIRECT_DELAY_MS = 1800;

/**
 * Clicking the verify-email link both verifies AND authenticates - no separate
 * login step afterwards, on whatever device the link was opened from (backend
 * now returns a full token pair from /auth/verify-email - see AuthService.verifyEmail).
 */
export function useVerifyEmail() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const mutation = useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onSuccess: (auth) => {
      setSession(auth);

      const destination = auth.activePersona === "user" ? "/user/dashboard" : resolvePostLoginRedirect(auth.roles);

      // Let the green-tick success state show briefly before navigating away.
      window.setTimeout(() => router.push(destination), SUCCESS_REDIRECT_DELAY_MS);
    },
  });

  return {
    verify: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    errorMessage: mutation.error ? getApiErrorMessage(mutation.error) : null,
  };
}
