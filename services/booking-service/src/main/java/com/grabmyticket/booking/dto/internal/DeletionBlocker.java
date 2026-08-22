package com.grabmyticket.booking.dto.internal;

/**
 * One reason a customer/organizer profile deletion is currently blocked (or,
 * in the warnings list, a heads-up that isn't a hard stop). code is a stable
 * machine-readable identifier the frontend branches on - never the free-text
 * message. Same shape as event-service's copy of this record (duplicated
 * per-service rather than shared via a common module, same convention as
 * TicketTypeSnapshot).
 */
public record DeletionBlocker(String code, String message, int count) {
}
