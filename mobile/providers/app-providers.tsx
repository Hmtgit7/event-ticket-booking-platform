import * as React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAuthStore } from "@/store/auth-store";
import { QueryProvider } from "@/lib/query-client";

/**
 * Single composition root for every cross-cutting provider (safe-area
 * insets, data fetching, auth hydration). Mounted once from app/_layout.tsx.
 * Kept as its own file (rather than inlined in the layout) so the layout
 * stays focused on navigation structure - same separation-of-concerns
 * convention used throughout client/.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate);

  React.useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <SafeAreaProvider>
      <QueryProvider>{children}</QueryProvider>
    </SafeAreaProvider>
  );
}
