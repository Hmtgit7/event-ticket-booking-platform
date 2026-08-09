"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Ticket } from "lucide-react";
import { CATEGORY_VISUAL } from "@/enums/event-category.enum";
import { bookingService } from "@/services/booking.service";
import { ApiError } from "@/lib/api-client";
import { formatEventDate, formatEventTime } from "@/lib/events";
import type { BookingResponse } from "@/interfaces/booking-api.interface";

interface BookingDetailContainerProps {
  bookingId: string;
}

const STATUS_LABEL: Record<BookingResponse["status"], string> = {
  CONFIRMED: "Confirmed",
  PENDING: "Pending",
  CANCELLED: "Cancelled",
  FAILED: "Failed",
};

/** "View ticket" page - the same route the confirmation email's button links to (see notification-service's email.templates.ts ticketUrl). */
export function BookingDetailContainer({ bookingId }: BookingDetailContainerProps) {
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    let cancelled = false;
    bookingService
      .getBooking(bookingId)
      .then((result) => {
        if (!cancelled) setBooking(result);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) setNotFoundFlag(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  if (notFoundFlag) notFound();

  if (loading) {
    return (
      <p className="rounded-2xl border border-line bg-surface px-5 py-12 text-center text-sm text-ink-muted">
        Loading ticket…
      </p>
    );
  }

  if (!booking) {
    return (
      <p className="rounded-2xl border border-line bg-surface px-5 py-12 text-center text-sm text-brand">
        Couldn&apos;t load this ticket. Please try again.
      </p>
    );
  }

  const visual = CATEGORY_VISUAL.Music;

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/user/dashboard/orders"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-muted transition hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Back to Orders
      </Link>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div
          className="relative flex h-40 items-end p-6"
          style={{
            background: booking.eventBannerUrl
              ? `url(${booking.eventBannerUrl}) center/cover`
              : `linear-gradient(160deg, ${visual.from}, ${visual.to})`,
          }}
        >
          <h1 className="text-2xl font-black text-on-elevated drop-shadow">{booking.eventTitle}</h1>
        </div>

        <div className="flex flex-col gap-5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Booking code</p>
              <p className="mt-1 font-mono text-lg font-black tracking-widest text-ink">{booking.bookingCode}</p>
            </div>
            <span className="rounded-lg border border-positive/30 bg-positive/10 px-3 py-1.5 text-xs font-bold text-positive">
              {STATUS_LABEL[booking.status]}
            </span>
          </div>

          <div className="grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
            <div>
              <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                <Calendar className="size-3.5" /> Date & time
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {formatEventDate(booking.eventStartAt)} · {formatEventTime(booking.eventStartAt)}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                <Ticket className="size-3.5" /> Tickets
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {booking.quantity} × {booking.ticketTypeName}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-line pt-5">
            <p className="text-sm text-ink-muted">Total paid</p>
            <p className="text-2xl font-black text-ink">${booking.totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
