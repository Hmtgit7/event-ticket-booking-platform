import { bookingApiClient } from "@/lib/api-client";
import type { PageResponse } from "@/interfaces/event-api.interface";
import type {
  CreateSupportTicketPayload,
  SupportTicketResponse,
  SupportTicketStatus,
  UpdateSupportTicketPayload,
} from "@/interfaces/admin-support-api.interface";

/** Thin wrapper over booking-service's support ticket endpoints - customer/organizer submission and admin triage. */
export const supportTicketService = {
  createTicket: (payload: CreateSupportTicketPayload) =>
    bookingApiClient.post<SupportTicketResponse>("/support/tickets", payload),

  getMyTickets: (page = 0, size = 20) =>
    bookingApiClient.get<PageResponse<SupportTicketResponse>>(`/support/tickets/mine?page=${page}&size=${size}`),

  getMyTicket: (id: string) => bookingApiClient.get<SupportTicketResponse>(`/support/tickets/${id}`),
};

export const adminSupportTicketService = {
  getAllTickets: (status: SupportTicketStatus | "All", page = 0, size = 20) =>
    bookingApiClient.get<PageResponse<SupportTicketResponse>>(
      `/admin/support/tickets?page=${page}&size=${size}${status !== "All" ? `&status=${status}` : ""}`,
    ),

  getTicket: (id: string) => bookingApiClient.get<SupportTicketResponse>(`/admin/support/tickets/${id}`),

  updateTicket: (id: string, payload: UpdateSupportTicketPayload) =>
    bookingApiClient.patch<SupportTicketResponse>(`/admin/support/tickets/${id}`, payload),
};
