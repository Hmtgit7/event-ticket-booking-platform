import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { resolvePostLoginRedirect, sanitizeRedirectParam } from "@/modules/auth/utils/post-login-redirect";
import { getApiErrorMessage } from "@/modules/auth/utils/get-api-error-message";
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

  return {
    login: mutation.mutate,
    isPending: mutation.isPending,
    errorMessage: mutation.error ? getApiErrorMessage(mutation.error) : null,
  };
}
