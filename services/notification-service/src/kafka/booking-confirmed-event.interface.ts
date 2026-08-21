/** Mirrors booking-service's BookingConfirmedEvent.java field-for-field - the JSON contract, not a shared library (each service stays independently deployable). */
export interface BookingConfirmedEvent {
  eventType: 'booking.confirmed';
  bookingId: string;
  bookingCode: string;
  userId: string;
  userEmail: string;
  eventId: string;
  organizerId: string;
  eventTitle: string;
  eventStartAt: string;
  eventBannerUrl: string | null;
  ticketTypeName: string;
  venueName: string | null;
  address: string | null;
  city: string | null;
  quantity: number;
  totalAmount: string;
  confirmedAt: string;
}
