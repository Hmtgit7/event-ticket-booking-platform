package com.grabmyticket.payment.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.grabmyticket.payment.service.PayoutExecutionService;

/**
 * Consumes booking-service's booking-events topic. Only acts on
 * eventType=payout.approved - other event types on this topic (e.g.
 * booking.confirmed, which this service has no reason to know about) are
 * silently ignored, same filtering pattern as booking-service's own
 * PaymentEventListener.
 */
@Component
public class PayoutEventListener {

    private static final Logger log = LoggerFactory.getLogger(PayoutEventListener.class);

    private final PayoutExecutionService payoutExecutionService;
    private final ObjectMapper objectMapper;

    public PayoutEventListener(PayoutExecutionService payoutExecutionService, ObjectMapper objectMapper) {
        this.payoutExecutionService = payoutExecutionService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "${app.booking.events-topic}")
    public void onBookingEvent(String payload) {
        PayoutApprovedEvent event;
        try {
            event = objectMapper.readValue(payload, PayoutApprovedEvent.class);
        } catch (Exception ex) {
            log.error("Failed to deserialize booking-events payload, skipping: {}", payload, ex);
            return;
        }

        if (!PayoutApprovedEvent.TYPE.equals(event.eventType())) {
            return;
        }

        payoutExecutionService.execute(event);
    }
}
