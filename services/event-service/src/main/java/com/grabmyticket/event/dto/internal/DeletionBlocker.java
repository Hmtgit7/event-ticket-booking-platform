package com.grabmyticket.event.dto.internal;

/**
 * One reason an organizer/customer profile deletion is currently blocked.
 * code is a stable machine-readable identifier the frontend branches on
 * (never the free-text message) - same convention as ErrorResponse.code.
 * This exact shape (code/message/count) is duplicated per-service rather
 * than shared via a common module, matching how TicketTypeSnapshot is
 * already duplicated between event-service and booking-service.
 */
public record DeletionBlocker(String code, String message, int count) {
}
