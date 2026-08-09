package com.grabmyticket.booking.client;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** Shared secret sent as X-Internal-Api-Key when calling event-service's /internal/** endpoints - same value on both sides, same pattern as JWT_SECRET. */
@ConfigurationProperties(prefix = "app.internal")
public record InternalApiKeyProperties(String secret) {
}
