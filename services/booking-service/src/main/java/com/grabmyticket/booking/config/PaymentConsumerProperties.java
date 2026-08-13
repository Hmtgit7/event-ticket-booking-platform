package com.grabmyticket.booking.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** The Kafka topic payment-service publishes PaymentCompletedEvent to - must match its app.payment.events-topic exactly. */
@ConfigurationProperties(prefix = "app.payment")
public record PaymentConsumerProperties(String eventsTopic) {
}
