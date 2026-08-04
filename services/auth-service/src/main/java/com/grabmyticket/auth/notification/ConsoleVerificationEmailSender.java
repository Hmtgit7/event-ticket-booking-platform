package com.grabmyticket.auth.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.grabmyticket.auth.entity.User;

/**
 * TEMPORARY stub. Logs each link instead of emailing it.
 *
 * TODO: replaced by a Brevo-backed sender in Chunk 2. Until then, grab the
 * link from this service's logs to test verify / link-password / reset flows.
 */
@Component
public class ConsoleVerificationEmailSender implements VerificationEmailSender {

    private static final Logger log = LoggerFactory.getLogger(ConsoleVerificationEmailSender.class);

    private final String frontendBaseUrl;

    public ConsoleVerificationEmailSender(
            @Value("${app.frontend-base-url:http://localhost:3000}") String frontendBaseUrl
    ) {
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
                "\n==================== {} EMAIL (stub - not actually sent) ====================\n"
                        + "To:   {}\n"
                        + "Link: {}\n"
                        + "==========================================================================================",
                kind,
                user.getEmail(),
                link
        );
    }
}
