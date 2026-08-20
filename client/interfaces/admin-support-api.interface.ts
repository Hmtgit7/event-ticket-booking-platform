/**
 * Shapes for booking-service's /support/tickets and /admin/support/tickets
 * endpoints. Field names match SupportTicketResponse.java exactly.
 */

export type SupportTicketCategory = "REFUND" | "TECHNICAL" | "EVENT_ISSUE" | "PAYMENT" | "OTHER";

export type SupportTicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export type SupportTicketPriority = "LOW" | "MEDIUM" | "HIGH";

export type RelatedEntityType = "BOOKING" | "PAYOUT_REQUEST" | "CANCELLATION_REQUEST";

export interface SupportTicketResponse {
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: SupportTicketCategory;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  relatedEntityType: RelatedEntityType | null;
  relatedEntityId: string | null;
  resolutionNote: string | null;
  assignedAdminId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupportTicketPayload {
  subject: string;
  description: string;
  category: SupportTicketCategory;
  relatedEntityType?: RelatedEntityType | null;
  relatedEntityId?: string | null;
}

/** All fields optional - PATCH semantics, admin sends only what they're changing. */
export interface UpdateSupportTicketPayload {
  status?: SupportTicketStatus;
  priority?: SupportTicketPriority;
  resolutionNote?: string;
  assignedAdminId?: string;
}
