import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
import { CATEGORY_VISUAL } from "@/enums/event-category.enum";
import { EVENT_STATUS_LABEL } from "@/enums/event-status.enum";
import { NavRoute } from "@/enums/nav-route.enum";
import type { DashboardEvent } from "@/interfaces/event.interface";
import { ProgressBar } from "@/components/common/progress-bar";

interface EventCardProps {
  event: DashboardEvent;
}

/** Grid tile for the Events listing page — category-tinted art, status
 * pill, meta row and a tickets-sold progress bar. */
export function EventCard({ event }: EventCardProps) {
  const visual = CATEGORY_VISUAL[event.category];
  const Icon = visual.icon;
  const price = event.price === "free" ? "Free" : `$${event.price}`;

  return (
    <Link
      href={`${NavRoute.Events}/${event.id}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-surface shadow-sm transition-shadow hover:shadow-md"
    >
      <div
        className="relative flex h-36 items-center justify-center"
        style={{ background: `linear-gradient(160deg, ${visual.from}, ${visual.to})` }}
      >
        <Icon className="size-10 text-on-elevated/70 transition-transform group-hover:scale-110" />
        <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-on-elevated">
          {event.category}
        </span>
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-on-elevated">
          <span className="size-1.5 rounded-full bg-positive" />
          {EVENT_STATUS_LABEL[event.status]}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-base font-bold text-ink">{event.title}</p>
          <span className="shrink-0 text-base font-bold text-ink">{price}</span>
        </div>

        <div className="flex flex-col gap-1 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {event.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {event.time}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            {event.location.city}, {event.location.venue}
          </span>
        </div>

        <ProgressBar percent={event.ticketsSoldPct} className="mt-1" />
      </div>
    </Link>
  );
}
