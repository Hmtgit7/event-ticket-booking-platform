import * as React from "react";
import { Text, View, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { Link, router } from "expo-router";

import { Screen } from "@/components/ui/screen";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/lib/api-client";

export default function LoginScreen() {
  const { setSession } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleLogin() {
    setError(null);
    setLoading(true);
    try {
      const auth = await authService.login({ email: email.trim(), password });
      await setSession(auth);
      router.replace("/(tabs)");
    } catch (err) {
      const body = err instanceof ApiError ? (err.body as { message?: string } | undefined) : undefined;
      setError(body?.message ?? (err instanceof Error ? err.message : "Something went wrong"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center px-6"
      >
        <View className="gap-2 pb-10">
          <Text className="font-heading text-3xl font-bold text-ink">Welcome back</Text>
          <Text className="text-base text-ink-muted">Log in to book tickets for shows near you.</Text>
        </View>

        <View className="gap-4">
          <Input
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
          />
          {error ? <Text className="text-sm text-brand">{error}</Text> : null}
          <Button onPress={handleLogin} loading={loading} disabled={!email || !password}>
            Log in
          </Button>
        </View>

        <View className="flex-row justify-center gap-1 pt-8">
          <Text className="text-ink-muted">Don&apos;t have an account?</Text>
          <Link href="/(auth)/signup" asChild>
            <Pressable>
              <Text className="font-semibold text-brand">Sign up</Text>
            </Pressable>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
