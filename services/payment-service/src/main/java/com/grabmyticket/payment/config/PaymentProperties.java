package com.grabmyticket.payment.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Razorpay credentials + the Kafka topic this service publishes payment
 * outcomes to. keySecret/webhookSecret never leave this service - not even
 * as a log line (see RazorpayService for the signature-verification path
 * that actually uses webhookSecret).
 */
@ConfigurationProperties(prefix = "app")
public record PaymentProperties(Razorpay razorpay, Payment payment) {

    public record Razorpay(String keyId, String keySecret, String webhookSecret) {
    }

    public record Payment(String eventsTopic) {
    }
}
