package com.grabmyticket.auth.dto;

/**
 * One reason a deletion is blocked, or (in a warnings list) a non-blocking
 * heads-up like a forfeitable wallet balance. Doubles as both the wire shape
 * deserialized from booking-service/event-service's internal deletion-check
 * endpoints AND the shape returned to the frontend from
 * GET /auth/me/deletion-eligibility - same record, no translation needed,
 * since all three services agree on this exact contract by convention.
 */
public record DeletionBlocker(String code, String message, int count) {
}
