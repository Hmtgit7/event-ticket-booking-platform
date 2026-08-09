import { bookingApiClient } from "@/lib/api-client";
import type { PageResponse } from "@/interfaces/event-api.interface";
import type { BookingResponse, CreateBookingPayload } from "@/interfaces/booking-api.interface";

/** Thin wrapper over booking-service's /bookings REST API. No business logic here - that lives in the containers. */
export const bookingService = {
  createBooking: (payload: CreateBookingPayload) => bookingApiClient.post<BookingResponse>("/bookings", payload),

  myBookings: (page = 0, size = 20) =>
    bookingApiClient.get<PageResponse<BookingResponse>>(`/bookings/mine?page=${page}&size=${size}`),

  getBooking: (id: string) => bookingApiClient.get<BookingResponse>(`/bookings/${id}`),
};
