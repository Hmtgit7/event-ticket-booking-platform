"use client";

import Link from "next/link";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { CATEGORY_VISUAL, type EventCategory } from "@/enums/event-category.enum";
import type { EventSummaryResponse } from "@/interfaces/event-api.interface";
import { formatEventDate, formatEventTime, formatPrice } from "@/lib/events";
import { cn } from "@/lib/utils";
import { BookNowAction } from "@/components/public-events/book-now-action";

interface PublicEventCardProps {
  event: EventSummaryResponse;
  variant?: "grid" | "list";
}

export function PublicEventCard({ event, variant = "grid" }: PublicEventCardProps) {
  const visual = CATEGORY_VISUAL[event.category as EventCategory];
  const seatsLeft = Math.max(event.totalCapacity - event.totalSold, 0);
  const eventPath = `/user/dashboard/explore/${event.slug}`;
  const isList = variant === "list";

  return (
    <article className={cn(
      "overflow-hidden rounded-2xl border border-line bg-canvas shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:shadow-black/25",
      isList && "grid md:grid-cols-[320px_1fr]",
    )}>
      <div
        className={cn("relative h-56 bg-cover bg-center", isList && "md:h-full md:min-h-64")}
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
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-on-elevated">
          <h3 className={cn("font-bold leading-tight", isList ? "text-3xl" : "text-xl")}>{event.title}</h3>
          <p className="rounded-xl bg-brand px-3 py-2 text-sm font-bold text-brand-foreground">
            {formatPrice(event.fromPrice)}
          </p>
        </div>
      </div>

      <div className={cn("flex flex-col gap-4 p-5", isList && "justify-between")}>
        <div className="grid gap-2 text-sm font-medium text-ink-muted sm:grid-cols-2">
          <p className="flex items-center gap-2"><Calendar className="size-4" />{formatEventDate(event.startAt)}</p>
          <p className="flex items-center gap-2"><Clock className="size-4" />{formatEventTime(event.startAt)}</p>
          <p className="flex items-center gap-2 sm:col-span-2"><MapPin className="size-4" />{event.venueName}, {event.city}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Ticket className="size-4 text-brand" />
            {seatsLeft} seats left
          </p>
          <div className="flex flex-wrap items-center gap-2">
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
