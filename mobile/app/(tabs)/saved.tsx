import { Text, View } from "react-native";
import { Heart } from "lucide-react-native";

import { Screen } from "@/components/ui/screen";

/**
 * Placeholder - mirrors client/app/user/dashboard/saved/page.tsx. Wire up to
 * store/saved-events-store.ts once ported (needs a persisted zustand store,
 * same shape as the web client's, plus an endpoint to sync across devices).
 */
export default function SavedScreen() {
  return (
    <Screen>
      <View className="flex-1 items-center justify-center gap-3 px-8">
        <Heart color="#8a8375" size={40} />
        <Text className="text-center text-lg font-semibold text-ink">No saved events yet</Text>
        <Text className="text-center text-ink-muted">
          Tap the heart icon on any event to save it here for later.
        </Text>
      </View>
    </Screen>
  );
}
