import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY_VISUAL } from "@/enums/event-category.enum";
import { formatEventDate } from "@/lib/events";
import type { BookingResponse } from "@/interfaces/booking-api.interface";

interface NextTicketCardProps {
  order: BookingResponse;
}

/**
 * Hero card on the overview page. Shows the most recent confirmed booking
 * with a full-bleed cover (banner if the event has one, a gradient
 * fallback otherwise), an overlay with the event details, and a
 * download ticket CTA.
 */
export function NextTicketCard({ order }: NextTicketCardProps) {
  const visual = CATEGORY_VISUAL.Music;

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div
        className="relative h-72 bg-cover bg-center"
        style={{
          background: order.eventBannerUrl
            ? `url(${order.eventBannerUrl}) center/cover`
            : `linear-gradient(160deg, ${visual.from}, ${visual.to})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <p className="text-sm font-semibold opacity-80">Next ticket</p>
          <h2 className="mt-1 font-heading text-3xl font-extrabold">{order.eventTitle}</h2>
          <p className="mt-2 flex flex-wrap gap-3 text-sm text-white/85">
            <span>{formatEventDate(order.eventStartAt)}</span>
            <span>
              {order.quantity} × {order.ticketTypeName}
            </span>
            <span>Order {order.bookingCode}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Keep this ready for entry</p>
          <p className="text-sm text-ink-muted">Show your booking code at the gate.</p>
        </div>
        <Button size="lg">
          <Download className="size-4" />
          Download ticket
        </Button>
      </div>
    </article>
  );
}
