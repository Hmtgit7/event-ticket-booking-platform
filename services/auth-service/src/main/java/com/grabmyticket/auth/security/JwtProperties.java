package com.grabmyticket.auth.security;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Binds app.jwt.* from application.yaml (values backed by JWT_SECRET,
 * JWT_ACCESS_TOKEN_TTL, JWT_REFRESH_TOKEN_TTL env vars - see .env.example).
 */
@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(
        String issuer,
        String secret,
        Duration accessTokenTtl,
        Duration refreshTokenTtl
) {
}
