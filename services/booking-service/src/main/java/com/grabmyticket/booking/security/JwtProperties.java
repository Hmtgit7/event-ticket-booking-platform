package com.grabmyticket.booking.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** Verify-only: booking-service never issues tokens, only checks ones auth-service signed. */
@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(String issuer, String secret) {
}
