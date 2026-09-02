import { Stack } from "expo-router";

/** Auth flow shares one Stack, no tab bar - matches client's /auth/* route group. */
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
