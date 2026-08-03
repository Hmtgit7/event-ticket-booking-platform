import { useRouter } from "next/navigation";

import { authService } from "@/services/auth.service";
import { tokenStorage } from "@/lib/token-storage";
import { useAuthStore } from "@/store/auth-store";

export function useLogout() {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);

  return function logout() {
    const refreshToken = tokenStorage.getRefreshToken();
    // Fire-and-forget: even if the revoke call fails (network blip), clear
    // local state immediately so the UI reflects "logged out" without delay.
    if (refreshToken) {
      void authService.logout(refreshToken).catch(() => undefined);
    }
    clearSession();
    router.push("/auth/login");
  };
}
