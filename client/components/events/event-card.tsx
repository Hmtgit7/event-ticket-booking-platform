import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
import { CATEGORY_VISUAL, type EventCategory } from "@/enums/event-category.enum";
import { NavRoute } from "@/enums/nav-route.enum";
import type { EventSummaryResponse } from "@/interfaces/event-api.interface";
import { ProgressBar } from "@/components/common/progress-bar";
import { STATUS_BADGE, formatEventDate, formatEventTime, formatPrice, ticketsSoldPct } from "@/lib/events";

interface EventCardProps {
  event: EventSummaryResponse;
}

/** Category tiles are keyed to a fixed set - fall back gracefully if an organizer's free-text category doesn't match one (shouldn't happen via the wizard's <select>, but defends against stale data). */
const DEFAULT_VISUAL = { icon: CATEGORY_VISUAL.Music.icon, from: "#242424", to: "#0a0a0a" };

/** Grid tile for the Events listing page — category-tinted art, status
 * pill, meta row and a tickets-sold progress bar. */
export function EventCard({ event }: EventCardProps) {
  const visual = CATEGORY_VISUAL[event.category as EventCategory] ?? DEFAULT_VISUAL;
  const Icon = visual.icon;
  const badge = STATUS_BADGE[event.status];
  const sold = ticketsSoldPct(event.totalSold, event.totalCapacity);

  return (
    <Link
      href={`${NavRoute.Events}/${event.id}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-surface shadow-sm transition-shadow hover:shadow-md"
    >
      <div
        className="relative flex h-36 items-center justify-center bg-cover bg-center"
        style={{
          background: event.bannerImageUrl
            ? `url(${event.bannerImageUrl}) center/cover`
            : `linear-gradient(160deg, ${visual.from}, ${visual.to})`,
        }}
      >
        {!event.bannerImageUrl && <Icon className="size-10 text-on-elevated/70 transition-transform group-hover:scale-110" />}
        <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-on-elevated">
          {event.category}
        </span>
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-on-elevated">
          <span className={`size-1.5 rounded-full ${badge.dotClass}`} />
          {badge.label}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-base font-bold text-ink">{event.title}</p>
          <span className="shrink-0 text-base font-bold text-ink">{formatPrice(event.fromPrice)}</span>
        </div>

        <div className="flex flex-col gap-1 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {formatEventDate(event.startAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {formatEventTime(event.startAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            {event.city}, {event.venueName}
          </span>
        </div>

        <ProgressBar percent={sold} className="mt-1" />
      </div>
    </Link>
  );
}
