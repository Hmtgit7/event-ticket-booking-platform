import * as React from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { Screen } from "@/components/ui/screen";
import { eventService } from "@/services/event.service";
import type { EventSummaryResponse } from "@/interfaces/event-api.interface";

function EventCard({ item }: { item: EventSummaryResponse }) {
  const dateLabel = new Date(item.startAt).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <Pressable
      onPress={() => router.push(`/event/${item.slug}`)}
      className="mb-4 overflow-hidden rounded-3xl border border-line bg-surface"
    >
      {item.bannerImageUrl ? (
        <Image source={{ uri: item.bannerImageUrl }} className="h-40 w-full" resizeMode="cover" />
      ) : (
        <View className="h-40 w-full items-center justify-center bg-surface-elevated">
          <Text className="text-on-elevated">{item.category}</Text>
        </View>
      )}
      <View className="gap-1 p-4">
        <Text className="text-xs font-semibold uppercase tracking-wide text-brand">{dateLabel}</Text>
        <Text className="text-lg font-semibold text-ink" numberOfLines={2}>
          {item.title}
        </Text>
        <Text className="text-sm text-ink-muted">
          {item.venueName} · {item.city}
        </Text>
        <Text className="pt-1 text-base font-semibold text-ink">
          {item.fromPrice ? `From ₹${item.fromPrice}` : "Free"}
        </Text>
      </View>
    </Pressable>
  );
}

/**
 * Customer home screen - browse published events. Mirrors the public
 * listing in client/app/events/page.tsx. Filters (category/city/search) are
 * deferred to a follow-up pass - see mobile/README.md backlog.
 */
export default function ExploreScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["events", "public"],
    queryFn: () => eventService.publicEvents({ size: 20 }),
  });

  return (
    <Screen>
      <View className="px-5 pb-2 pt-4">
        <Text className="font-heading text-2xl font-bold text-ink">Discover shows</Text>
        <Text className="text-ink-muted">Stand-up comedy near you</Text>
      </View>

      {isError ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-ink-muted">Couldn&apos;t load events. Pull down to retry.</Text>
        </View>
      ) : (
        <FlatList
          data={data?.items ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EventCard item={item} />}
          contentContainerClassName="px-5 pb-8 pt-2"
          refreshing={isLoading || isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={
            !isLoading ? (
              <View className="items-center pt-24">
                <Text className="text-ink-muted">No events published yet - check back soon.</Text>
              </View>
            ) : null
          }
        />
      )}
    </Screen>
  );
}
