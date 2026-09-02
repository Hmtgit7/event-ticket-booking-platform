import * as React from "react";
import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { LogOut, ChevronRight, ShieldCheck } from "lucide-react-native";

import { Screen } from "@/components/ui/screen";
import { useAuth } from "@/hooks/use-auth";
import { authService } from "@/services/auth.service";
import { tokenStorage } from "@/lib/token-storage";

const MENU_ITEMS = [
  { label: "Order history", href: "/(tabs)/tickets" as const },
  { label: "Saved events", href: "/(tabs)/saved" as const },
  { label: "Wallet", href: "/(tabs)/wallet" as const },
];

/** Mirrors client/app/user/dashboard/profile/page.tsx - trimmed to the fields already in AuthUser. */
export default function ProfileScreen() {
  const { user, clearSession } = useAuth();
  const [loggingOut, setLoggingOut] = React.useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    const refreshToken = tokenStorage.getRefreshToken();
    try {
      if (refreshToken) await authService.logout(refreshToken);
    } catch {
      // Best-effort - clear the local session regardless of server response.
    } finally {
      await clearSession();
      setLoggingOut(false);
      router.replace("/(auth)/login");
    }
  }

  return (
    <Screen>
      <View className="gap-1 px-5 pb-6 pt-4">
        <Text className="font-heading text-2xl font-bold text-ink">{user?.fullName || "Your account"}</Text>
        <Text className="text-ink-muted">{user?.email}</Text>
        {!user?.emailVerified && (
          <View className="mt-2 flex-row items-center gap-1.5 self-start rounded-full bg-surface-hover px-3 py-1">
            <ShieldCheck size={14} color="#8a8375" />
            <Text className="text-xs text-ink-muted">Email not verified</Text>
          </View>
        )}
      </View>

      <View className="gap-px px-5">
        {MENU_ITEMS.map((item) => (
          <Pressable
            key={item.href}
            onPress={() => router.push(item.href)}
            className="flex-row items-center justify-between rounded-2xl border border-line bg-surface px-4 py-4"
          >
            <Text className="text-base text-ink">{item.label}</Text>
            <ChevronRight size={18} color="#8a8375" />
          </Pressable>
        ))}
      </View>

      <View className="mt-auto px-5 pb-6">
        <Pressable
          onPress={handleLogout}
          disabled={loggingOut}
          className="flex-row items-center justify-center gap-2 rounded-2xl border border-line py-4"
        >
          <LogOut size={18} color="#e2543c" />
          <Text className="text-base font-semibold text-brand">{loggingOut ? "Logging out…" : "Log out"}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
