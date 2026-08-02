package com.grabmyticket.auth.security;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** Binds app.verification.* - see .env.example for the backing env vars. */
@ConfigurationProperties(prefix = "app.verification")
public record VerificationProperties(
        Duration tokenTtl,
        Duration resendCooldown
) {
}
