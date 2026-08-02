package com.grabmyticket.auth.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.grabmyticket.auth.entity.User;

/**
 * TEMPORARY stub. Logs the verification link instead of emailing it.
 *
 * TODO (post-notification-service SMTP setup): replace with either
 *   (a) a direct SMTP call, or
 *   (b) publishing a "user.verification-requested" event to Kafka for
 *       notification-service to consume - matches the pattern booking-service
 *       will use for booking confirmations.
 * Until then: grab the link from this service's logs to test the flow.
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
        String link = frontendBaseUrl + "/auth/verify-email?token=" + rawToken;
        log.info(
                "\n==================== VERIFICATION EMAIL (stub - not actually sent) ====================\n"
                        + "To:   {}\n"
                        + "Link: {}\n"
                        + "==========================================================================================",
                user.getEmail(),
                link
        );
    }
}
