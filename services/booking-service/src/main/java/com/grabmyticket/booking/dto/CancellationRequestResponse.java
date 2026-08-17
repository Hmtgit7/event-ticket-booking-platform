package com.grabmyticket.booking.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import com.grabmyticket.booking.entity.CancellationStatus;

public record CancellationRequestResponse(
        UUID id,
        UUID bookingId,
        String reason,
        CancellationStatus status,
        BigDecimal refundAmount,
        String reviewNote,
        Instant reviewedAt,
        Instant createdAt
) {
}
