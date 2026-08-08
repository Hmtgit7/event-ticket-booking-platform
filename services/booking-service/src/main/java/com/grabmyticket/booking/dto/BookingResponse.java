package com.grabmyticket.booking.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import com.grabmyticket.booking.entity.BookingStatus;

public record BookingResponse(
        UUID id,
        String bookingCode,
        UUID eventId,
        UUID ticketTypeId,
        String eventTitle,
        Instant eventStartAt,
        String eventBannerUrl,
        String ticketTypeName,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal totalAmount,
        BookingStatus status,
        Instant cancelledAt,
        Instant createdAt
) {
}
