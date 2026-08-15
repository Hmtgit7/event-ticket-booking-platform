package com.grabmyticket.booking.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** platformCommissionRate is a fraction (0.10 = 10%), applied to gross confirmed-booking revenue before an organizer's available payout balance is computed. Business-decided value, not a technical default - confirm the actual rate before go-live. */
@ConfigurationProperties(prefix = "app.booking")
public record BookingProperties(String holdTtl, String eventsTopic, java.math.BigDecimal platformCommissionRate) {
}
