import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { getApiErrorMessage } from "@/modules/auth/utils/get-api-error-message";
import type { SignupPayload } from "@/interfaces/auth.interface";

export function useSignup() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const mutation = useMutation({
    mutationFn: (payload: SignupPayload) => authService.signup(payload),
    onSuccess: (result) => {
      if (result.accountCreated && result.auth) {
        setSession(result.auth);
        // Always send new signups to verify-email, regardless of role - even
        // organizers can't do anything useful until they verify (see auth-service
        // Phase 3/6: organizer role is inert pre-verification).
        router.push("/auth/verify-email");
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
  };
}
