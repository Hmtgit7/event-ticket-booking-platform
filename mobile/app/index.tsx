import * as React from "react";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { useAuth } from "@/hooks/use-auth";

/**
 * Root route - decides (auth) vs (tabs) once hydration finishes, then hides
 * the native splash screen (held open by app/_layout.tsx). Renders nothing
 * itself; the splash screen covers this frame so there's no visible flash.
 */
export default function Index() {
  const { isAuthenticated, isHydrated } = useAuth();

  React.useEffect(() => {
    if (isHydrated) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isHydrated]);

  if (!isHydrated) {
    return null;
  }

  return <Redirect href={isAuthenticated ? "/(tabs)" : "/(auth)/login"} />;
}
