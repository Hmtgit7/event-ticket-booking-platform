package com.grabmyticket.payment.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** The Kafka topic booking-service publishes PayoutApprovedEvent to - must match its app.booking.events-topic exactly. */
@ConfigurationProperties(prefix = "app.booking")
public record BookingConsumerProperties(String eventsTopic) {

    public String resolvedEventsTopic() {
        return (eventsTopic == null || eventsTopic.isBlank()) ? "booking-events" : eventsTopic;
    }
}
