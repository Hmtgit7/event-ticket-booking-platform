package com.grabmyticket.auth.notification;

import com.grabmyticket.auth.entity.User;

/**
 * Abstraction over "send this user a verification email".
 * Implemented for now by ConsoleVerificationEmailSender (logs the link).
 * Swap in a real implementation (SMTP call, or a Kafka event consumed by
 * notification-service) later WITHOUT touching VerificationTokenService.
 */
public interface VerificationEmailSender {
    void sendVerificationEmail(User user, String rawToken);
}
