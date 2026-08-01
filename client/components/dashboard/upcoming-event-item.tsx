import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
import { CATEGORY_VISUAL } from "@/enums/event-category.enum";
import type { DashboardEvent } from "@/interfaces/event.interface";
import { NavRoute } from "@/enums/nav-route.enum";

interface UpcomingEventItemProps {
  event: DashboardEvent;
}

/** Compact card used in the dashboard's "Upcoming Events" list — a small
 * photo-substitute tile plus the event's date/time/location meta. */
export function UpcomingEventItem({ event }: UpcomingEventItemProps) {
  const visual = CATEGORY_VISUAL[event.category];
  const Icon = visual.icon;
  const price = event.price === "free" ? "Free" : `$${event.price}/ Ticket`;

  return (
    <Link
      href={`${NavRoute.Events}/${event.id}`}
      className="group flex gap-3 rounded-2xl bg-surface p-2 shadow-sm transition-shadow hover:shadow-md"
    >
      <div
        className="relative flex h-20 w-24 shrink-0 items-center justify-center rounded-xl"
        style={{ background: `linear-gradient(160deg, ${visual.from}, ${visual.to})` }}
      >
        <Icon className="size-7 text-on-elevated/80" />
        <span className="absolute right-1.5 top-1.5 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-on-elevated">
          About
        </span>
      </div>

      <div className="min-w-0 py-1">
        <p className="truncate text-sm font-semibold text-ink">{event.title}</p>
        <div className="mt-1.5 flex items-center gap-1 text-xs text-ink-muted">
          <Calendar className="size-3" />
          {event.date.split(",")[0]}
          <Clock className="ml-1.5 size-3" />
          {event.time}
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-xs text-ink-muted">
            <MapPin className="size-3" />
            {event.location.city}
          </span>
          <span className="text-xs font-semibold text-ink">{price}</span>
        </div>
      </div>
    </Link>
  );
}
