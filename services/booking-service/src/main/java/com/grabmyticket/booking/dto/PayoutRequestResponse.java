package com.grabmyticket.booking.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import com.grabmyticket.booking.entity.PayoutStatus;

public record PayoutRequestResponse(
        UUID id,
        UUID organizerId,
        BigDecimal amount,
        PayoutStatus status,
        String reviewNote,
        Instant reviewedAt,
        Instant createdAt
) {
}
