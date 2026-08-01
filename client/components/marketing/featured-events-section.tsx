import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { PUBLIC_EVENTS } from "@/constants/public-events";

const FEATURED = PUBLIC_EVENTS.slice(0, 3);

export function FeaturedEventsSection() {
  return (
    <section className="border-b border-line bg-canvas py-16 sm:py-20 dark:bg-[#0f0c08]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">Public discovery</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">Browse events people can book today.</h2>
          </div>
          <Link href="/events" className="inline-flex items-center gap-2 text-sm font-bold text-brand">
            View all events
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {FEATURED.map((event) => (
            <article key={event.id} className="overflow-hidden rounded-[24px] border border-line bg-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:bg-[#1c1711] dark:shadow-black/25">
              <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url(${event.image})` }} />
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">{event.category}</p>
                <h3 className="mt-2 text-xl font-bold text-ink">{event.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{event.tagline}</p>
                <div className="mt-4 space-y-2 text-sm font-medium text-ink-muted">
                  <p className="flex items-center gap-2"><Calendar className="size-4" />{event.date} · {event.time}</p>
                  <p className="flex items-center gap-2"><MapPin className="size-4" />{event.location.venue}, {event.location.city}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
