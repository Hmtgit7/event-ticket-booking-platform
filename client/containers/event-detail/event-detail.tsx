import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
import { MOCK_EVENTS } from "@/constants/mock-events";
import { CATEGORY_VISUAL } from "@/enums/event-category.enum";
import { EVENT_STATUS_LABEL } from "@/enums/event-status.enum";
import { NavRoute } from "@/enums/nav-route.enum";
import { buttonVariants } from "@/components/ui/button";
import { DonutChart } from "@/components/charts/donut-chart";
import { MockMap } from "@/components/common/mock-map";
import { ProgressBar } from "@/components/common/progress-bar";

interface EventDetailProps {
  eventId: string;
}

/** Single-event detail page: hero art, description, an attendee-rate
 * gauge, and the event's location card. */
export function EventDetail({ eventId }: EventDetailProps) {
  const event = MOCK_EVENTS.find((item) => item.id === eventId);
  if (!event) notFound();

  const visual = CATEGORY_VISUAL[event.category];
  const Icon = visual.icon;

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <div className="flex flex-col gap-5 xl:col-span-2">
        <div
          className="relative flex h-72 items-center justify-center overflow-hidden rounded-3xl"
          style={{ background: `linear-gradient(160deg, ${visual.from}, ${visual.to})` }}
        >
          <Icon className="size-16 text-on-elevated/60" />
          <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1.5 text-xs font-medium text-on-elevated">
            {event.category}
          </span>
          <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-xs font-medium text-on-elevated">
            <span className="size-1.5 rounded-full bg-positive" />
            {EVENT_STATUS_LABEL[event.status]}
          </span>
        </div>

        <div className="rounded-3xl bg-surface p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-ink">{event.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-ink-muted">
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              {event.time}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              {event.date}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              {event.location.city}, {event.location.venue}
            </span>
          </div>
          <p className="mt-4 leading-7 text-ink-muted">{event.description}</p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <ProgressBar percent={event.ticketsSoldPct} className="max-w-xs flex-1" />
            <Link href={`${NavRoute.Events}/${event.id}/insights`} className={buttonVariants({ size: "lg" })}>
              Edit Event
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-3xl bg-surface p-6 text-center shadow-sm">
          <h2 className="text-left text-lg font-bold text-ink">Attendee Rate</h2>
          <p className="text-left text-xs text-ink-muted">
            {event.totalTicketsBooked.toLocaleString()} Total Tickets Booked
          </p>
          <div className="flex justify-center py-4">
            <DonutChart
              segments={[{ label: "Attending", value: event.attendeeRatePct, color: "var(--color-ink)" }]}
              centerValue={`${event.attendeeRatePct}%`}
              centerLabel="Will Attend the Event"
              size={220}
            />
          </div>
        </div>

        <div className="rounded-3xl bg-surface p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-ink">Location</h2>
          <p className="mb-3 flex items-center gap-1.5 text-sm text-ink-muted">
            <MapPin className="size-4" />
            {event.location.city}, {event.location.venue}
          </p>
          <MockMap location={event.location} />
        </div>
      </div>
    </div>
  );
}
