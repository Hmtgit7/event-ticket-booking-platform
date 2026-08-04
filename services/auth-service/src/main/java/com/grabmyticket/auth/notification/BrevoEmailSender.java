package com.grabmyticket.auth.notification;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import com.grabmyticket.auth.entity.User;
import com.grabmyticket.auth.exception.EmailDeliveryException;
import com.grabmyticket.auth.security.BrevoProperties;

/**
 * Sends verify / link-password / reset-password emails through Brevo's
 * transactional email API (https://api.brevo.com/v3/smtp/email).
 * Selected instead of ConsoleVerificationEmailSender by EmailConfig whenever
 * BREVO_API_KEY and SMTP_FROM are both set.
 */
public class BrevoEmailSender implements VerificationEmailSender {

    private static final Logger log = LoggerFactory.getLogger(BrevoEmailSender.class);
    private static final String BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

    private final RestClient restClient;
    private final BrevoProperties brevoProperties;
    private final String frontendBaseUrl;

    public BrevoEmailSender(BrevoProperties brevoProperties, String frontendBaseUrl) {
        this.brevoProperties = brevoProperties;
        this.frontendBaseUrl = frontendBaseUrl;
        this.restClient = RestClient.builder()
                .baseUrl(BREVO_ENDPOINT)
                .defaultHeader("api-key", brevoProperties.apiKey())
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("Accept", "application/json")
                .build();
    }

    @Override
    public void sendVerificationEmail(User user, String rawToken) {
        String link = frontendBaseUrl + "/auth/verify-email?token=" + rawToken;
        String html = EmailTemplates.button(
                "Confirm your email",
                "Welcome to GrabMyTicket! Click below to verify your email address and activate your account. This link expires in 24 hours.",
                link,
                "Verify email"
        );
        send(user, "Verify your GrabMyTicket account", html);
    }

    @Override
    public void sendLinkPasswordEmail(User user, String rawToken) {
        String link = frontendBaseUrl + "/auth/link-password?token=" + rawToken;
        String html = EmailTemplates.button(
                "Add password login to your account",
                "You already have a GrabMyTicket account signed in with Google using this email. Click below to also set a password, so you can log in either way. This link expires in 24 hours.",
                link,
                "Set password"
        );
        send(user, "Enable password login for your GrabMyTicket account", html);
    }

    @Override
    public void sendPasswordResetEmail(User user, String rawToken) {
        String link = frontendBaseUrl + "/auth/reset-password?token=" + rawToken;
        String html = EmailTemplates.button(
                "Reset your password",
                "We received a request to reset your GrabMyTicket password. Click below to choose a new one. This link expires in 24 hours.",
                link,
                "Reset password"
        );
        send(user, "Reset your GrabMyTicket password", html);
    }

    private void send(User user, String subject, String htmlContent) {
        Map<String, Object> body = Map.of(
                "sender", Map.of("name", brevoProperties.senderName(), "email", brevoProperties.senderEmail()),
                "to", List.of(Map.of("email", user.getEmail(), "name", user.getFullName())),
                "subject", subject,
                "htmlContent", htmlContent
        );

        try {
            restClient.post()
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientResponseException ex) {
            log.error("Brevo rejected email send to {}: {} - {}", user.getEmail(), ex.getStatusCode(), ex.getResponseBodyAsString());
            throw new EmailDeliveryException("Failed to send email via Brevo", ex);
        } catch (Exception ex) {
            log.error("Brevo email send failed for {}", user.getEmail(), ex);
            throw new EmailDeliveryException("Failed to send email via Brevo", ex);
        }
    }
}
