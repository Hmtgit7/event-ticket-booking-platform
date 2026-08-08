import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { resolvePostLoginRedirect, sanitizeRedirectParam } from "@/modules/auth/utils/post-login-redirect";
import { getApiErrorMessage, isEmailNotVerifiedError } from "@/modules/auth/utils/get-api-error-message";
import type { LoginPayload } from "@/interfaces/auth.interface";

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);

  const mutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (auth) => {
      setSession(auth);

      const redirect = sanitizeRedirectParam(searchParams?.get("redirect") ?? null);
      if (redirect) {
        router.push(redirect);
        return;
      }

      // Dual-role accounts land back in whichever persona they last used - this is
      // server state (auth.activePersona, from auth-service's User.activePersona),
      // not a browser cookie, so it's correct even on a fresh device/browser/logout.
      if (auth.activePersona === "user") {
        router.push("/user/dashboard");
        return;
      }

      router.push(resolvePostLoginRedirect(auth.roles));
    },
  });

  // Correct password, correct email, account just isn't verified yet - the login
  // form renders a dedicated "please verify your account" screen for this case
  // instead of a generic error banner (see login-form.tsx).
  const isUnverified = isEmailNotVerifiedError(mutation.error);

  return {
    login: mutation.mutate,
    isPending: mutation.isPending,
    isUnverified,
    // Clears the mutation's error state - lets the unverified-account screen's
    // "Back to login" button return to a clean form instead of a full reload.
    reset: mutation.reset,
    // Don't surface the raw error message when it's the unverified case - the
    // dedicated screen has its own copy, no need for a redundant banner too.
    errorMessage: mutation.error && !isUnverified ? getApiErrorMessage(mutation.error) : null,
  };
}
