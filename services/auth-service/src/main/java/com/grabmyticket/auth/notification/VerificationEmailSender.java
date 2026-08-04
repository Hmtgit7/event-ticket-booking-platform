package com.grabmyticket.auth.notification;

import com.grabmyticket.auth.entity.User;

/**
 * Abstraction over "send this user a link-based transactional email".
 * Implemented for now by ConsoleVerificationEmailSender (logs the link).
 * Chunk 2 swaps in a Brevo-backed implementation WITHOUT touching
 * VerificationTokenService - it only ever talks to this interface.
 */
public interface VerificationEmailSender {

    /** New local signup - must verify before logging in. */
    void sendVerificationEmail(User user, String rawToken);

    /** Google-only account attempting a password signup with the same email - link instead of block. */
    void sendLinkPasswordEmail(User user, String rawToken);

    /** Forgot-password flow. */
    void sendPasswordResetEmail(User user, String rawToken);
}
