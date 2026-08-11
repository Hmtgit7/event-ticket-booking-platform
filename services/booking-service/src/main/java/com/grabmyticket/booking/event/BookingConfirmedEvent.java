package com.grabmyticket.booking.event;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Plain JSON contract for notification-service's Kafka consumer. eventType
 * is the discriminator a polyglot consumer reads - not a Kafka header, not a
 * Java class name. Adding a new consumer later (analytics, SMS, whatever)
 * never means touching this record or the code that publishes it.
 */
public record BookingConfirmedEvent(
        String eventType,
        UUID bookingId,
        String bookingCode,
        UUID userId,
        String userEmail,
        UUID eventId,
        UUID organizerId,
        String eventTitle,
        Instant eventStartAt,
        String eventBannerUrl,
        String ticketTypeName,
        Integer quantity,
        BigDecimal totalAmount,
        Instant confirmedAt
) {
    public static final String TYPE = "booking.confirmed";
}
