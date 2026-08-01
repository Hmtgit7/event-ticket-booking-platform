import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import type { PublicEvent } from "@/constants/public-events";

interface PublicEventCardProps {
  event: PublicEvent;
}

export function PublicEventCard({ event }: PublicEventCardProps) {
  const price = event.price === "free" ? "Free" : `$${event.price}`;

  return (
    <article className="overflow-hidden rounded-[24px] border border-line bg-canvas shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:bg-[#211b14] dark:shadow-black/25">
      <div className="relative h-56 bg-cover bg-center" style={{ backgroundImage: `url(${event.image})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4 rounded-xl bg-black/55 px-3 py-1.5 text-xs font-bold text-on-elevated backdrop-blur">
          {event.category}
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-on-elevated">
          <div>
            <p className="text-xs font-medium text-on-elevated/75">Hosted by {event.host}</p>
            <h3 className="mt-1 text-2xl font-bold leading-tight">{event.title}</h3>
          </div>
          <p className="rounded-xl bg-brand px-3 py-2 text-sm font-bold text-brand-foreground">{price}</p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <p className="text-sm leading-6 text-ink-muted">{event.tagline}</p>
        <div className="grid gap-2 text-sm font-medium text-ink-muted sm:grid-cols-2">
          <p className="flex items-center gap-2"><Calendar className="size-4" />{event.date}</p>
          <p className="flex items-center gap-2"><Clock className="size-4" />{event.time}</p>
          <p className="flex items-center gap-2 sm:col-span-2"><MapPin className="size-4" />{event.location.venue}, {event.location.city}</p>
        </div>
        <div className="flex items-center justify-between border-t border-line pt-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Ticket className="size-4 text-brand" />
            {event.seatsLeft} seats left
          </p>
          <button type="button" className="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-brand-foreground">
            View details
          </button>
        </div>
      </div>
    </article>
  );
}
