import Image from "next/image";
import { Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublicEvent } from "@/constants/public-events";

interface EventBrowseCardProps {
  event: PublicEvent;
}

function formatPrice(price: string | number) {
  return price === "free" ? "Free" : `$${price}`;
}

/**
 * Event card used in the Explore section of the user dashboard.
 * Shows cover image, title, tagline, price badge, city, and quick actions.
 */
export function EventBrowseCard({ event }: EventBrowseCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface transition hover:shadow-md">
      <div className="relative h-44">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="360px"
          className="object-cover"
        />
        <span className="absolute right-3 top-3 rounded-lg bg-surface/90 px-2 py-1 text-xs font-bold text-ink backdrop-blur-sm">
          {event.category}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-ink">{event.title}</h3>
            <p className="mt-0.5 line-clamp-1 text-sm text-ink-muted">{event.tagline}</p>
          </div>
          <span className="shrink-0 rounded-lg bg-brand px-2.5 py-1 text-xs font-bold text-brand-foreground">
            {formatPrice(event.price)}
          </span>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-sm text-ink-muted">
          <MapPin className="size-3.5 shrink-0" />
          {event.location.city}
        </p>

        <div className="mt-4 flex gap-2">
          <Button size="sm" className="flex-1">Book now</Button>
          <Button variant="outline" size="icon-sm" aria-label={`Save ${event.title}`}>
            <Heart className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
