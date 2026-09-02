import { useAuthStore } from "@/store/auth-store";

/**
 * Thin convenience hook over useAuthStore - keeps screens from importing the
 * store directly and reaching into its internals. Mirrors how client
 * components consume useAuthStore(), just named for discoverability.
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  return {
    user,
    isHydrated,
    isAuthenticated: user !== null,
    setSession,
    clearSession,
  };
}
