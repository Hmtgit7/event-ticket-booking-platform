package com.grabmyticket.payment.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** Shared secret for service-to-service calls (booking-service -> payment-service). Same value on both sides via a shared Render Environment Group in prod. */
@ConfigurationProperties(prefix = "app.internal")
public record InternalApiKeyProperties(String secret) {
}
