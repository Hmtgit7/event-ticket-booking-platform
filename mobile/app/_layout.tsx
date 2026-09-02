import "../global.css";

import * as React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

import { AppProviders } from "@/providers/app-providers";

// Held open until app/index.tsx hides it once auth hydration finishes -
// prevents a flash of the (auth) group for users who are actually logged in.
SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Root layout - mounted once, wraps every route in AppProviders (data
 * fetching + auth hydration) and declares the top-level Stack. Route groups
 * ((auth) and (tabs)) each own their own header/navigation chrome; this
 * Stack just switches between them. See app/index.tsx for the
 * hydration-aware redirect that decides which group to land on.
 */
export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="event/[slug]" options={{ headerShown: true, title: "" }} />
      </Stack>
      <StatusBar style="auto" />
    </AppProviders>
  );
}
