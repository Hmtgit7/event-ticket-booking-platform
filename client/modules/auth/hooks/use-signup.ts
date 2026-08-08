import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { getApiErrorMessage } from "@/modules/auth/utils/get-api-error-message";
import type { SignupPayload } from "@/interfaces/auth.interface";

export function useSignup() {
  const setSession = useAuthStore((state) => state.setSession);

  const mutation = useMutation({
    mutationFn: (payload: SignupPayload) => authService.signup(payload),
    onSuccess: (result) => {
      if (result.accountCreated && result.auth) {
        setSession(result.auth);
        // Deliberately NOT navigating anywhere - "check your inbox" is an
        // in-page state on the signup form itself (see SignupForm), not a
        // separate /auth/verify-email route. A route backed by a lingering
        // authenticated-but-unverified session would keep resurrecting itself
        // on every later visit/refresh/browser reopen; an in-memory view
        // naturally disappears the moment the tab is closed or refreshed,
        // which is exactly the desired behavior.
      }
      // else: a Google-only account already existed for this email - no new
      // account was created, a link-password email was sent instead. Stay on
      // this page; SignupForm surfaces `linkPendingMessage` so the user knows
      // to check their inbox rather than seeing a dead-end "already exists" error.
    },
  });

  return {
    signup: mutation.mutate,
    isPending: mutation.isPending,
    errorMessage: mutation.error ? getApiErrorMessage(mutation.error) : null,
    linkPendingMessage: mutation.data && !mutation.data.accountCreated ? mutation.data.message : null,
    // True right after a brand-new account is created - drives SignupForm's
    // in-page "check your inbox" state.
    isAwaitingVerification: Boolean(mutation.data?.accountCreated),
  };
}
