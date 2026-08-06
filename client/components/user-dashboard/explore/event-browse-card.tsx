"use client";

import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { CATEGORY_VISUAL, type EventCategory } from "@/enums/event-category.enum";
import type { EventSummaryResponse } from "@/interfaces/event-api.interface";
import { formatPrice } from "@/lib/events";
import { useSavedEventsStore } from "@/store/saved-events-store";
import { cn } from "@/lib/utils";

interface EventBrowseCardProps {
  event: EventSummaryResponse;
}

/**
 * Event card used in the Explore section of the user dashboard.
 * Shows cover art, title, price badge, city, and a Book now action that
 * goes straight to this event's in-dashboard detail/booking page - no
 * login redirect needed since this page already requires a session.
 */
export function EventBrowseCard({ event }: EventBrowseCardProps) {
  const visual = CATEGORY_VISUAL[event.category as EventCategory];
  const saved = useSavedEventsStore((state) => state.isSaved(event.id));
  const toggleSaved = useSavedEventsStore((state) => state.toggleSaved);

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface transition hover:shadow-md">
      <div
        className="relative h-44 bg-cover bg-center"
        style={{
          background: event.bannerImageUrl
            ? `url(${event.bannerImageUrl}) center/cover`
            : `linear-gradient(160deg, ${visual?.from ?? "#242424"}, ${visual?.to ?? "#0a0a0a"})`,
        }}
      >
        <span className="absolute right-3 top-3 rounded-lg bg-surface/90 px-2 py-1 text-xs font-bold text-ink backdrop-blur-sm">
          {event.category}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-ink">{event.title}</h3>
          </div>
          <span className="shrink-0 rounded-lg bg-brand px-2.5 py-1 text-xs font-bold text-brand-foreground">
            {formatPrice(event.fromPrice)}
          </span>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-sm text-ink-muted">
          <MapPin className="size-3.5 shrink-0" />
          {event.city}
        </p>

        <div className="mt-4 flex gap-2">
          <Link href={`/user/dashboard/explore/${event.slug}`} className={buttonVariants({ size: "sm", className: "flex-1" })}>
            Book now
          </Link>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => toggleSaved(event)}
            aria-pressed={saved}
            aria-label={saved ? `Unsave ${event.title}` : `Save ${event.title}`}
          >
            <Heart className={cn("size-4", saved && "fill-brand text-brand")} />
          </Button>
        </div>
      </div>
    </article>
  );
}
