import { useQuery } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";

/** GET /auth/me - used by settings pages that need hasPassword/rolePromptSeen beyond the auth-store's slimmer AuthUser. */
export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authService.me(),
  });
}
