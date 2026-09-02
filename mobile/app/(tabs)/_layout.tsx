import { Tabs, Redirect } from "expo-router";
import { Compass, Heart, Ticket, Wallet, User } from "lucide-react-native";

import { useAuth } from "@/hooks/use-auth";

const ACTIVE_COLOR = "#e2543c";
const INACTIVE_COLOR = "#8a8375";

/**
 * Primary customer tab bar - mirrors the section set in
 * client/app/user/dashboard/* (explore, orders, saved, wallet, profile).
 * Organizer-mode navigation is web-only for now (see mobile/README.md).
 * Gated behind auth: an unauthenticated user landing here (e.g. deep link)
 * bounces to login rather than rendering an empty/errored tab bar.
 */
export default function TabsLayout() {
  const { isAuthenticated, isHydrated } = useAuth();

  if (isHydrated && !isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: { backgroundColor: "#f6f1e7", borderTopColor: "#ddd3bf" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Explore", tabBarIcon: ({ color, size }) => <Compass color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="saved"
        options={{ title: "Saved", tabBarIcon: ({ color, size }) => <Heart color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="tickets"
        options={{ title: "Tickets", tabBarIcon: ({ color, size }) => <Ticket color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="wallet"
        options={{ title: "Wallet", tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
    </Tabs>
  );
}
