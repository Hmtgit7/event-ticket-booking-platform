package com.grabmyticket.event.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** Shared secret for service-to-service calls (booking-service -> event-service). Same value on both sides via a shared Render Environment Group in prod, same pattern as JWT_SECRET. */
@ConfigurationProperties(prefix = "app.internal")
public record InternalApiKeyProperties(String secret) {
}
