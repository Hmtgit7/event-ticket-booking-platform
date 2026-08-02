package com.grabmyticket.auth.security;

import java.security.SecureRandom;
import java.util.Base64;

import org.springframework.stereotype.Component;

/**
 * Generates opaque, unguessable tokens for email verification (and later,
 * password reset). Deliberately NOT a JWT - these are single-use, stored and
 * checked against the DB, and revocable, which a self-contained JWT can't do
 * without extra bookkeeping anyway.
 */
@Component
public class TokenGenerator {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();

    public String generate() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return ENCODER.encodeToString(bytes);
    }
}
