/** Shapes returned by / sent to booking-service's booking endpoints. Field names match CreateBookingRequest.java / BookingResponse.java exactly. */

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "FAILED";

export interface CreateBookingPayload {
  eventId: string;
  ticketTypeId: string;
  quantity: number;
}

export interface BookingResponse {
  id: string;
  bookingCode: string;
  eventId: string;
  ticketTypeId: string;
  eventTitle: string;
  eventStartAt: string;
  /** Nullable only for events with no timezone set (pre-globalization events) - see booking-service's Booking.eventTimezone. */
  eventTimezone: string | null;
  eventBannerUrl: string | null;
  ticketTypeName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: BookingStatus;
  cancelledAt: string | null;
  createdAt: string;
}
