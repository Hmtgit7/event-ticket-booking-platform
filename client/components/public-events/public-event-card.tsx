"use client";

import Link from "next/link";
import { Calendar, Clock, MapPin, Ticket, Heart } from "lucide-react";
import { CATEGORY_VISUAL, type EventCategory } from "@/enums/event-category.enum";
import type { EventSummaryResponse } from "@/interfaces/event-api.interface";
import { formatEventDate, formatEventTime, formatPrice } from "@/lib/events";
import { useSavedEventsStore } from "@/store/saved-events-store";
import { cn } from "@/lib/utils";
import { BookNowAction } from "@/components/public-events/book-now-action";

interface PublicEventCardProps {
  event: EventSummaryResponse;
}

export function PublicEventCard({ event }: PublicEventCardProps) {
  const visual = CATEGORY_VISUAL[event.category as EventCategory];
  const seatsLeft = Math.max(event.totalCapacity - event.totalSold, 0);
  const saved = useSavedEventsStore((state) => state.isSaved(event.id));
  const toggleSaved = useSavedEventsStore((state) => state.toggleSaved);
  const eventPath = `/user/dashboard/explore/${event.slug}`;

  return (
    <article className="overflow-hidden rounded-[24px] border border-line bg-canvas shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:bg-[#211b14] dark:shadow-black/25">
      <div
        className="relative h-56 bg-cover bg-center"
        style={{
          background: event.bannerImageUrl
            ? `url(${event.bannerImageUrl}) center/cover`
            : `linear-gradient(160deg, ${visual?.from ?? "#242424"}, ${visual?.to ?? "#0a0a0a"})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4 rounded-xl bg-black/55 px-3 py-1.5 text-xs font-bold text-on-elevated backdrop-blur">
          {event.category}
        </div>
        <button
          type="button"
          onClick={() => toggleSaved(event)}
          aria-pressed={saved}
          aria-label={saved ? `Unsave ${event.title}` : `Save ${event.title}`}
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-black/55 text-on-elevated backdrop-blur transition hover:bg-black/70"
        >
          <Heart className={cn("size-4", saved && "fill-brand text-brand")} />
        </button>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-on-elevated">
          <h3 className="text-2xl font-bold leading-tight">{event.title}</h3>
          <p className="rounded-xl bg-brand px-3 py-2 text-sm font-bold text-brand-foreground">
            {formatPrice(event.fromPrice)}
          </p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid gap-2 text-sm font-medium text-ink-muted sm:grid-cols-2">
          <p className="flex items-center gap-2"><Calendar className="size-4" />{formatEventDate(event.startAt)}</p>
          <p className="flex items-center gap-2"><Clock className="size-4" />{formatEventTime(event.startAt)}</p>
          <p className="flex items-center gap-2 sm:col-span-2"><MapPin className="size-4" />{event.venueName}, {event.city}</p>
        </div>
        <div className="flex items-center justify-between border-t border-line pt-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Ticket className="size-4 text-brand" />
            {seatsLeft} seats left
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={`/events/${event.slug}`}
              className="rounded-xl border border-line px-4 py-2 text-sm font-bold text-ink transition hover:border-brand hover:text-brand"
            >
              View details
            </Link>
            <BookNowAction
              eventPath={eventPath}
              className="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-brand-foreground"
            >
              Book now
            </BookNowAction>
          </div>
        </div>
      </div>
    </article>
  );
}
