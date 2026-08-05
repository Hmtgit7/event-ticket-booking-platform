import Link from "next/link";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { CATEGORY_VISUAL, type EventCategory } from "@/enums/event-category.enum";
import type { EventSummaryResponse } from "@/interfaces/event-api.interface";
import { formatEventDate, formatEventTime, formatPrice } from "@/lib/events";

interface PublicEventCardProps {
  event: EventSummaryResponse;
}

export function PublicEventCard({ event }: PublicEventCardProps) {
  const visual = CATEGORY_VISUAL[event.category as EventCategory];
  const seatsLeft = Math.max(event.totalCapacity - event.totalSold, 0);

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
          <Link
            href={`/events/${event.slug}`}
            className="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-brand-foreground"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
