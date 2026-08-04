package com.grabmyticket.auth.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.grabmyticket.auth.notification.BrevoEmailSender;
import com.grabmyticket.auth.notification.ConsoleVerificationEmailSender;
import com.grabmyticket.auth.notification.VerificationEmailSender;
import com.grabmyticket.auth.security.BrevoProperties;

@Configuration
@EnableConfigurationProperties(BrevoProperties.class)
public class EmailConfig {

    private static final Logger log = LoggerFactory.getLogger(EmailConfig.class);

    /**
     * Real Brevo delivery when BREVO_API_KEY + SMTP_FROM are set (all real
     * environments should have these); otherwise falls back to logging the
     * link to the console, so a fresh local checkout works without needing
     * Brevo credentials on day one.
     */
    @Bean
    public VerificationEmailSender verificationEmailSender(
            BrevoProperties brevoProperties,
            @Value("${app.frontend-base-url}") String frontendBaseUrl
    ) {
        if (brevoProperties.isConfigured()) {
            log.info("Email delivery: Brevo (sender: {})", brevoProperties.senderEmail());
            return new BrevoEmailSender(brevoProperties, frontendBaseUrl);
        }

        log.warn("BREVO_API_KEY / SMTP_FROM not set - falling back to console-logged email links. "
                + "Set both env vars to send real emails.");
        return new ConsoleVerificationEmailSender(frontendBaseUrl);
    }
}
