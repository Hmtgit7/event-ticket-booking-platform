import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { getApiErrorMessage } from "@/modules/auth/utils/get-api-error-message";

/** Self-service USER -> ORGANIZER upgrade. Backend rejects with 403 if email isn't verified yet. */
export function useBecomeOrganizer() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const mutation = useMutation({
    mutationFn: () => authService.becomeOrganizer(),
    onSuccess: (auth) => {
      setSession(auth);
      router.push("/dashboard");
    },
  });

  return {
    becomeOrganizer: mutation.mutate,
    isPending: mutation.isPending,
    errorMessage: mutation.error ? getApiErrorMessage(mutation.error) : null,
  };
}
