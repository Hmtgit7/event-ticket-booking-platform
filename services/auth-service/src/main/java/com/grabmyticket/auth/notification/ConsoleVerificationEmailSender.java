package com.grabmyticket.auth.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.grabmyticket.auth.entity.User;

/**
 * Local-dev fallback. Logs each link instead of emailing it - used automatically
 * whenever BREVO_API_KEY / SMTP_FROM aren't set (see EmailConfig), so a fresh
 * checkout still works end-to-end without needing real Brevo credentials.
 */
public class ConsoleVerificationEmailSender implements VerificationEmailSender {

    private static final Logger log = LoggerFactory.getLogger(ConsoleVerificationEmailSender.class);

    private final String frontendBaseUrl;

    public ConsoleVerificationEmailSender(String frontendBaseUrl) {
        this.frontendBaseUrl = frontendBaseUrl;
    }

    @Override
    public void sendVerificationEmail(User user, String rawToken) {
        logLink("VERIFY EMAIL", user, "/auth/verify-email?token=" + rawToken);
    }

    @Override
    public void sendLinkPasswordEmail(User user, String rawToken) {
        logLink("LINK PASSWORD", user, "/auth/link-password?token=" + rawToken);
    }

    @Override
    public void sendPasswordResetEmail(User user, String rawToken) {
        logLink("RESET PASSWORD", user, "/auth/reset-password?token=" + rawToken);
    }

    private void logLink(String kind, User user, String path) {
        String link = frontendBaseUrl + path;
        log.info(
                "\n==================== {} EMAIL (stub - BREVO_API_KEY not set, not actually sent) ====================\n"
                        + "To:   {}\n"
                        + "Link: {}\n"
                        + "==========================================================================================",
                kind,
                user.getEmail(),
                link
        );
    }
}
