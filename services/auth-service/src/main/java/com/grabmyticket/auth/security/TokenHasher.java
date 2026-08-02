package com.grabmyticket.auth.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

import org.springframework.stereotype.Component;

/**
 * Hashes refresh tokens before they're persisted. Same principle as password
 * hashing: if the DB ever leaks, raw refresh tokens should not be recoverable
 * from it. SHA-256 (not BCrypt) is fine here - unlike passwords, these are
 * already high-entropy random tokens, not something an attacker can dictionary-
 * attack, so we don't need BCrypt's deliberate slowness.
 */
@Component
public class TokenHasher {

    public String hash(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashed);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 is not available", ex);
        }
    }
}
