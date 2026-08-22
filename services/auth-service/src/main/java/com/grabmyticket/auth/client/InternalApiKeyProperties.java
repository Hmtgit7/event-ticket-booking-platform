package com.grabmyticket.auth.client;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** Shared secret sent as X-Internal-Api-Key when calling booking-service/event-service's /internal/** endpoints - same value on every side, same pattern as JWT_SECRET. auth-service has only ever been a JWT issuer until Phase 9's account-deletion flow needed it to call other services itself. */
@ConfigurationProperties(prefix = "app.internal")
public record InternalApiKeyProperties(String secret) {
}
