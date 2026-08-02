package com.grabmyticket.auth.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import com.grabmyticket.auth.entity.Role;
import com.grabmyticket.auth.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

/**
 * Issues and validates access tokens. This is the ONLY thing that signs tokens
 * in the whole platform - event-service and booking-service only ever verify,
 * using a copy of the same JWT_SECRET (see JwtAuthenticationFilter, reused as-is
 * in those services in Phase 6).
 */
@Service
public class JwtService {

    private final JwtProperties properties;
    private final SecretKey key;

    public JwtService(JwtProperties properties) {
        this.properties = properties;
        this.key = Keys.hmacShaKeyFor(properties.secret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(User user) {
        Instant now = Instant.now();
        Instant expiry = now.plus(properties.accessTokenTtl());
        List<String> roleNames = user.getRoles().stream().map(Role::getName).toList();

        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("roles", roleNames)
                .claim("emailVerified", user.isEmailVerified())
                .issuer(properties.issuer())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(key)
                .compact();
    }

    /** Throws io.jsonwebtoken.JwtException (or a subclass) if invalid/expired/tampered. */
    public Claims parseAndValidate(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public long getAccessTokenTtlSeconds() {
        return properties.accessTokenTtl().getSeconds();
    }
}
