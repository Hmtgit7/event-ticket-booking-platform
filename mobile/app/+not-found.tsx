import { Text, View } from "react-native";
import { Link, Stack } from "expo-router";

import { Screen } from "@/components/ui/screen";

export default function NotFoundScreen() {
  return (
    <Screen>
      <Stack.Screen options={{ title: "Not found" }} />
      <View className="flex-1 items-center justify-center gap-3 px-8">
        <Text className="text-lg font-semibold text-ink">This screen doesn&apos;t exist.</Text>
        <Link href="/" className="text-brand">
          Go back home
        </Link>
      </View>
    </Screen>
  );
}
