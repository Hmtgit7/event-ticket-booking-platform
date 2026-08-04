package com.grabmyticket.auth.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** Binds app.brevo.* - see .env.example for the backing env vars (BREVO_API_KEY, SMTP_FROM). */
@ConfigurationProperties(prefix = "app.brevo")
public record BrevoProperties(
        String apiKey,
        String senderEmail,
        String senderName
) {
    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank() && senderEmail != null && !senderEmail.isBlank();
    }
}
