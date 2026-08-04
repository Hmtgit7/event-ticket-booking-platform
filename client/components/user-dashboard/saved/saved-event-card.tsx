import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SavedEvent } from "@/constants/user-dashboard-data";

interface SavedEventCardProps {
  event: SavedEvent;
}

const CATEGORY_COLORS: Record<string, string> = {
  Fashion: "text-brand",
  Music:   "text-positive",
  Outdoor: "text-ink-muted",
};

/**
 * Card for a single saved / wishlisted event. Keeps it minimal —
 * category tag, title, date, city, and a CTA to view the event.
 */
export function SavedEventCard({ event }: SavedEventCardProps) {
  const colorClass = CATEGORY_COLORS[event.category] ?? "text-brand";

  return (
    <article className="flex flex-col justify-between gap-4 rounded-2xl border border-line bg-surface p-5 transition hover:shadow-md">
      <div>
        <p className={cn("text-xs font-semibold uppercase tracking-wide", colorClass)}>
          {event.category}
        </p>
        <h3 className="mt-2 text-xl font-black text-ink">{event.title}</h3>
        <p className="mt-1.5 text-sm text-ink-muted">
          {event.date} · {event.city}
        </p>
        <p className="mt-1 text-sm font-semibold text-ink">
          {event.price === "free" ? "Free" : `$${event.price}`}
        </p>
      </div>

      <Link
        href={`/events/${event.id}`}
        className={cn(buttonVariants({ size: "lg" }), "w-full justify-center")}
      >
        View event
      </Link>
    </article>
  );
}
