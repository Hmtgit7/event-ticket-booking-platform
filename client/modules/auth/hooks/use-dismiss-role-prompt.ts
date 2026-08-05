import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";

/** Declining the post-Google-login "also host events?" prompt - persists so it never resurfaces. */
export function useDismissRolePrompt() {
  const markRolePromptSeen = useAuthStore((state) => state.markRolePromptSeen);

  const mutation = useMutation({
    mutationFn: () => authService.dismissRolePrompt(),
    onSuccess: () => {
      markRolePromptSeen();
    },
  });

  return {
    dismiss: mutation.mutate,
    isPending: mutation.isPending,
  };
}
