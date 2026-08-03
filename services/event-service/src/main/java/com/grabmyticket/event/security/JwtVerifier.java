package com.grabmyticket.event.security;

import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

/**
 * Verifies JWTs signed by auth-service. Same JWT_SECRET as auth-service (set via
 * a shared Render Environment Group in prod) is what makes cross-service trust work -
 * no network call back to auth-service is ever made to validate a request.
 */
@Component
public class JwtVerifier {

    private final SecretKey key;

    public JwtVerifier(JwtProperties properties) {
        this.key = Keys.hmacShaKeyFor(properties.secret().getBytes(StandardCharsets.UTF_8));
    }

    /** Throws io.jsonwebtoken.JwtException (or a subclass) if invalid/expired/tampered. */
    public Claims parseAndValidate(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
