import { Text, View } from "react-native";
import { Wallet as WalletIcon } from "lucide-react-native";

import { Screen } from "@/components/ui/screen";

/**
 * Placeholder - mirrors client/app/user/dashboard/wallet/page.tsx. Wire up
 * to wallet.service.ts once ported. Remember: customer wallet is
 * closed-loop/spend-only (no withdrawal) per the RBI PPI compliance
 * decision recorded for this project - never add a withdraw action here.
 */
export default function WalletScreen() {
  return (
    <Screen>
      <View className="flex-1 items-center justify-center gap-3 px-8">
        <WalletIcon color="#8a8375" size={40} />
        <Text className="text-center text-lg font-semibold text-ink">₹0.00 balance</Text>
        <Text className="text-center text-ink-muted">
          Refunds and credits land here and can be spent on future bookings.
        </Text>
      </View>
    </Screen>
  );
}
