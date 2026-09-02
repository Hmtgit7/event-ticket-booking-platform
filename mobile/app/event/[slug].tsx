import * as React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { Screen } from "@/components/ui/screen";
import { Button } from "@/components/ui/button";
import { eventService } from "@/services/event.service";

/**
 * Event detail screen - mirrors client/app/events/[slug]/page.tsx. Booking
 * flow (ticket type selection, checkout) is stubbed behind the CTA for now
 * - see mobile/README.md backlog for booking-service integration.
 */
export default function EventDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const { data: event, isLoading } = useQuery({
    queryKey: ["events", "public", slug],
    queryFn: () => eventService.publicEventBySlug(slug),
    enabled: Boolean(slug),
  });

  if (isLoading || !event) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <Text className="text-ink-muted">Loading event…</Text>
        </View>
      </Screen>
    );
  }

  const startDate = new Date(event.startAt);
  const fromPrice = event.ticketTypes.reduce<number | null>((min, t) => {
    if (t.quantityAvailable <= 0) return min;
    return min === null ? t.price : Math.min(min, t.price);
  }, null);

  return (
    <Screen>
      <ScrollView contentContainerClassName="pb-8">
        {event.bannerImageUrl ? (
          <Image source={{ uri: event.bannerImageUrl }} className="h-56 w-full" resizeMode="cover" />
        ) : (
          <View className="h-56 w-full bg-surface-elevated" />
        )}

        <View className="gap-3 px-5 pt-5">
          <Text className="text-xs font-semibold uppercase tracking-wide text-brand">{event.category}</Text>
          <Text className="font-heading text-2xl font-bold text-ink">{event.title}</Text>

          <View className="gap-1 rounded-2xl border border-line bg-surface p-4">
            <Text className="text-sm text-ink-muted">
              {startDate.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })} ·{" "}
              {startDate.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
            </Text>
            <Text className="text-sm text-ink-muted">
              {event.venueName}, {event.city}
            </Text>
          </View>

          <Text className="pt-2 text-base leading-6 text-ink">{event.description}</Text>
        </View>
      </ScrollView>

      <View className="flex-row items-center justify-between border-t border-line bg-surface px-5 py-4">
        <View>
          <Text className="text-xs text-ink-muted">Starting from</Text>
          <Text className="text-lg font-bold text-ink">{fromPrice ? `₹${fromPrice}` : "Sold out"}</Text>
        </View>
        <Button disabled={fromPrice === null} className="px-8">
          Book now
        </Button>
      </View>
    </Screen>
  );
}
