import { Text, View } from "react-native";
import { Ticket } from "lucide-react-native";

import { Screen } from "@/components/ui/screen";

/**
 * Placeholder - mirrors client/app/user/dashboard/orders/*. Wire up to
 * booking.service.ts once ported (list bookings, QR code display for
 * check-in - see mobile/README.md backlog).
 */
export default function TicketsScreen() {
  return (
    <Screen>
      <View className="flex-1 items-center justify-center gap-3 px-8">
        <Ticket color="#8a8375" size={40} />
        <Text className="text-center text-lg font-semibold text-ink">No tickets yet</Text>
        <Text className="text-center text-ink-muted">
          Your booked tickets and QR codes for check-in will show up here.
        </Text>
      </View>
    </Screen>
  );
}
