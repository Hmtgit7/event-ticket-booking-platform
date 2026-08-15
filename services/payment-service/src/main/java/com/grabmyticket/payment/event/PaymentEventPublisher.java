package com.grabmyticket.payment.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.grabmyticket.payment.config.PaymentProperties;

/**
 * Fires only AFTER_COMMIT - same reasoning as booking-service's
 * BookingEventPublisher. RazorpayService publishes PaymentCompletedEvent as a
 * Spring ApplicationEvent from inside its @Transactional webhook handler, but
 * the Kafka send happens strictly after the PaymentTransaction row is
 * durably COMPLETED. Publishing mid-transaction would risk telling
 * booking-service about a payment that then rolls back for an unrelated
 * reason later in the method.
 */
@Component
public class PaymentEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(PaymentEventPublisher.class);

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final PaymentProperties paymentProperties;

    public PaymentEventPublisher(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper, PaymentProperties paymentProperties) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.paymentProperties = paymentProperties;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onPaymentCompleted(PaymentCompletedEvent event) {
        try {
            String payload = objectMapper.writeValueAsString(event);
            String topic = paymentProperties.payment().resolvedEventsTopic();
            kafkaTemplate.send(topic, event.paymentTransactionId().toString(), payload)
                    .whenComplete((result, ex) -> {
                        if (ex != null) {
                            // Never let a failed publish look like a failed payment - the
                            // PaymentTransaction row is already COMPLETED and correct. But
                            // this must be LOUD: a silently-swallowed send() here means a
                            // wallet never gets credited for a payment Razorpay actually
                            // captured, with no visible signal anywhere.
                            log.error("Failed to publish payment.completed event for transaction {}",
                                    event.paymentTransactionId(), ex);
                        } else {
                            log.info("Published payment.completed for transaction {}", event.paymentTransactionId());
                        }
                    });
        } catch (JsonProcessingException ex) {
            log.error("Failed to serialize payment.completed event for transaction {}", event.paymentTransactionId(), ex);
        }
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onPayoutExecuted(PayoutExecutedEvent event) {
        try {
            String payload = objectMapper.writeValueAsString(event);
            String topic = paymentProperties.payment().resolvedEventsTopic();
            kafkaTemplate.send(topic, event.payoutRequestId().toString(), payload)
                    .whenComplete((result, ex) -> {
                        if (ex != null) {
                            // Same severity as the payment.completed case above - the
                            // PayoutTransaction row is already terminal and correct, but a
                            // silently-swallowed send() here leaves booking-service's
                            // PayoutRequest stuck in APPROVED forever with no visible signal.
                            log.error("Failed to publish payout.executed event for payoutRequestId {}", event.payoutRequestId(), ex);
                        } else {
                            log.info("Published payout.executed ({}) for payoutRequestId {}", event.status(), event.payoutRequestId());
                        }
                    });
        } catch (JsonProcessingException ex) {
            log.error("Failed to serialize payout.executed event for payoutRequestId {}", event.payoutRequestId(), ex);
        }
    }
}
