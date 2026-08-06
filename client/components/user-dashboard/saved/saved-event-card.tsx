"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EventSummaryResponse } from "@/interfaces/event-api.interface";
import { formatEventDate, formatPrice } from "@/lib/events";
import { useSavedEventsStore } from "@/store/saved-events-store";

interface SavedEventCardProps {
  event: EventSummaryResponse;
}

/**
 * Card for a single saved / wishlisted event. Category tag, title, date,
 * city, a remove (X) button, and a CTA into the in-dashboard event page.
 */
export function SavedEventCard({ event }: SavedEventCardProps) {
  const removeSaved = useSavedEventsStore((state) => state.removeSaved);

  return (
    <article className="flex flex-col justify-between gap-4 rounded-2xl border border-line bg-surface p-5 transition hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">{event.category}</p>
          <button
            type="button"
            onClick={() => removeSaved(event.id)}
            aria-label={`Remove ${event.title} from saved`}
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-ink-muted transition hover:bg-surface-hover hover:text-ink"
          >
            <X className="size-4" />
          </button>
        </div>
        <h3 className="mt-2 text-xl font-black text-ink">{event.title}</h3>
        <p className="mt-1.5 text-sm text-ink-muted">
          {formatEventDate(event.startAt)} · {event.city}
        </p>
        <p className="mt-1 text-sm font-semibold text-ink">{formatPrice(event.fromPrice)}</p>
      </div>

      <Link
        href={`/user/dashboard/explore/${event.slug}`}
        className={cn(buttonVariants({ size: "lg" }), "w-full justify-center")}
      >
        View event
      </Link>
    </article>
  );
}
