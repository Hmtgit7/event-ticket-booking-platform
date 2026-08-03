import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { getApiErrorMessage } from "@/modules/auth/utils/get-api-error-message";

/**
 * Exchanges a Google ID token (obtained by NextAuth on the /auth/oauth-bridge
 * page) for our own AuthResponse. auth-service verifies the token's signature
 * server-side - this hook never trusts the token itself, only our backend's
 * response.
 *
 * Deliberately does NOT navigate here (unlike useLogin/useSignup) - the
 * oauth-bridge page decides where to go next, since a brand-new Google
 * account may need an extra "also organize?" step first.
 */
export function useGoogleAuth() {
  const setSession = useAuthStore((state) => state.setSession);

  const mutation = useMutation({
    mutationFn: (idToken: string) => authService.loginWithGoogle(idToken),
    onSuccess: (auth) => {
      setSession(auth);
    },
  });

  return {
    exchangeGoogleToken: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    errorMessage: mutation.error ? getApiErrorMessage(mutation.error) : null,
  };
}
