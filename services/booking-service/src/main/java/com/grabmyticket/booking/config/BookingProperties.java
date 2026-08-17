package com.grabmyticket.booking.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * platformCommissionRate and cancellationFeeRate are both fractions (0.10 =
 * 10%), both business-decided values, not technical defaults - confirm the
 * actual rates before go-live. cancellationFeeRate is deducted from
 * Booking.totalAmount before the remainder is refunded to the customer's
 * wallet on an approved cancellation (see CancellationService).
 */
@ConfigurationProperties(prefix = "app.booking")
public record BookingProperties(
        String holdTtl,
        String eventsTopic,
        java.math.BigDecimal platformCommissionRate,
        java.math.BigDecimal cancellationFeeRate
) {
}
