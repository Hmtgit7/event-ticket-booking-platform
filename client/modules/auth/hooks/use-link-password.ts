import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { resolvePostLoginRedirect } from "@/modules/auth/utils/post-login-redirect";
import { getApiErrorMessage } from "@/modules/auth/utils/get-api-error-message";
import type { LinkPasswordConfirmPayload } from "@/interfaces/auth.interface";

/** Confirming a link-password token attaches a password to the existing Google-only account and logs them in. */
export function useLinkPassword() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const mutation = useMutation({
    mutationFn: (payload: LinkPasswordConfirmPayload) => authService.confirmLinkPassword(payload),
    onSuccess: (auth) => {
      setSession(auth);
      router.push(resolvePostLoginRedirect(auth.roles));
    },
  });

  return {
    submit: mutation.mutate,
    isPending: mutation.isPending,
    errorMessage: mutation.error ? getApiErrorMessage(mutation.error) : null,
  };
}
