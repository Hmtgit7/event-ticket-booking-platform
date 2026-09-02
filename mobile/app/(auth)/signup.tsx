import * as React from "react";
import { Text, View, KeyboardAvoidingView, Platform, Pressable, ScrollView } from "react-native";
import { Link, router } from "expo-router";

import { Screen } from "@/components/ui/screen";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/lib/api-client";

export default function SignupScreen() {
  const { setSession } = useAuth();
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSignup() {
    setError(null);
    setLoading(true);
    try {
      const result = await authService.signup({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        // Mobile onboarding starts customer-first; becoming an organizer
        // is a later self-service upgrade (see client's role-prompt flow).
        wantsToOrganize: false,
      });

      if (result.auth) {
        await setSession(result.auth);
        router.replace("/(tabs)");
      } else {
        setError(result.message ?? "Check your email to continue.");
      }
    } catch (err) {
      const body = err instanceof ApiError ? (err.body as { message?: string } | undefined) : undefined;
      setError(body?.message ?? (err instanceof Error ? err.message : "Something went wrong"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerClassName="flex-1 justify-center px-6" keyboardShouldPersistTaps="handled">
          <View className="gap-2 pb-10">
            <Text className="font-heading text-3xl font-bold text-ink">Create your account</Text>
            <Text className="text-base text-ink-muted">Find and book the best stand-up shows around you.</Text>
          </View>

          <View className="gap-4">
            <Input label="Full name" value={fullName} onChangeText={setFullName} placeholder="Jane Doe" />
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
            <Button onPress={handleSignup} loading={loading} disabled={!fullName || !email || !password}>
              Sign up
            </Button>
          </View>

          <View className="flex-row justify-center gap-1 pt-8">
            <Text className="text-ink-muted">Already have an account?</Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text className="font-semibold text-brand">Log in</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
