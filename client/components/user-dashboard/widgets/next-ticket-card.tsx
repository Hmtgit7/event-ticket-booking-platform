import Image from "next/image";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OrderItem } from "@/constants/user-dashboard-data";

interface NextTicketCardProps {
  order: OrderItem;
}

/**
 * Hero card on the overview page. Shows the next upcoming event with a
 * full-bleed cover image, an overlay with the event details, and a
 * download ticket CTA.
 */
export function NextTicketCard({ order }: NextTicketCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="relative h-72">
        <Image
          src={order.image}
          alt={order.event}
          fill
          sizes="(min-width: 1280px) 760px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <p className="text-sm font-semibold opacity-80">Next ticket</p>
          <h2 className="mt-1 font-heading text-3xl font-extrabold">
            {order.event}
          </h2>
          <p className="mt-2 flex flex-wrap gap-3 text-sm text-white/85">
            <span>{order.date}</span>
            <span>{order.tickets}</span>
            <span>Order {order.id}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Gate opens at 8:15 AM</p>
          <p className="text-sm text-ink-muted">
            Keep your QR code and ID ready at entry.
          </p>
        </div>
        <Button size="lg">
          <Download className="size-4" />
          Download ticket
        </Button>
      </div>
    </article>
  );
}
