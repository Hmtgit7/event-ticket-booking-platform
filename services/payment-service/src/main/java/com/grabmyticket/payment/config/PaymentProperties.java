package com.grabmyticket.payment.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Razorpay credentials + Kafka topics this service publishes to/consumes.
 * razorpayX is a distinct product from the Payment Gateway (Contacts/Fund
 * Accounts/Payouts) - keyId/keySecret fall back to the main razorpay keys
 * via resolvedXKeyId()/resolvedXKeySecret() below if not explicitly set,
 * since many accounts use the same key pair for both once RazorpayX is
 * activated. accountNumber/payoutMode/payoutPurpose are only used by the
 * actual payout call (Phase 2c-ii), not Contact/Fund Account creation.
 */
@ConfigurationProperties(prefix = "app")
public record PaymentProperties(Razorpay razorpay, RazorpayX razorpayX, Payment payment) {

    public record Razorpay(String keyId, String keySecret, String webhookSecret) {
    }

    public record RazorpayX(String keyId, String keySecret, String accountNumber, String payoutMode, String payoutPurpose) {
    }

    public record Payment(String eventsTopic) {

        public String resolvedEventsTopic() {
            return (eventsTopic == null || eventsTopic.isBlank()) ? "payment-events" : eventsTopic;
        }
    }

    public String resolvedXKeyId() {
        return (razorpayX != null && razorpayX.keyId() != null && !razorpayX.keyId().isBlank())
                ? razorpayX.keyId() : razorpay.keyId();
    }

    public String resolvedXKeySecret() {
        return (razorpayX != null && razorpayX.keySecret() != null && !razorpayX.keySecret().isBlank())
                ? razorpayX.keySecret() : razorpay.keySecret();
    }
}
