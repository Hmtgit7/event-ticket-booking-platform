package com.grabmyticket.event.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** Verify-only: event-service never issues tokens, only checks ones auth-service signed. */
@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(String issuer, String secret) {
}
