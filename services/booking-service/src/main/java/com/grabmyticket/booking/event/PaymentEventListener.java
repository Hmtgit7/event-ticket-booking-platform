package com.grabmyticket.booking.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.grabmyticket.booking.service.PayoutService;
import com.grabmyticket.booking.service.WalletService;

/**
 * The single consumer for payment-service's payment-events topic - deliberately
 * one @KafkaListener per topic per consumer group. Two separate listener
 * beans both subscribed to this topic under the same "booking-service" group
 * (as this briefly was, before catching it) would have Kafka split messages
 * between them rather than delivering to both, since they'd be competing
 * consumers in one group, not independent subscribers.
 *
 * eventType is read first via a lightweight JsonNode peek, then dispatched
 * to the specific record type/handler. Unrecognized eventTypes are silently
 * ignored - payment-service can add new event types on this topic later
 * without this listener needing a matching change first. Never throws on a
 * malformed/unrecognized payload either, for the same reason: a listener
 * exception here would trigger Spring Kafka's default retry/DLQ behavior
 * against a message this service may never be able to parse, blocking the
 * partition.
 */
@Component
public class PaymentEventListener {

    private static final Logger log = LoggerFactory.getLogger(PaymentEventListener.class);

    private final WalletService walletService;
    private final PayoutService payoutService;
    private final ObjectMapper objectMapper;

    public PaymentEventListener(WalletService walletService, PayoutService payoutService, ObjectMapper objectMapper) {
        this.walletService = walletService;
        this.payoutService = payoutService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "${app.payment.events-topic}")
    public void onPaymentEvent(String payload) {
        JsonNode root;
        try {
            root = objectMapper.readTree(payload);
        } catch (Exception ex) {
            log.error("Failed to parse payment-events payload, skipping: {}", payload, ex);
            return;
        }

        String eventType = root.path("eventType").asText(null);
        if (PaymentCompletedEvent.TYPE.equals(eventType)) {
            handlePaymentCompleted(payload);
        } else if (PayoutExecutedEvent.TYPE.equals(eventType)) {
            handlePayoutExecuted(payload);
        }
        // Any other eventType is intentionally ignored.
    }

    private void handlePaymentCompleted(String payload) {
        try {
            PaymentCompletedEvent event = objectMapper.readValue(payload, PaymentCompletedEvent.class);
            if (!PaymentCompletedEvent.PURPOSE_WALLET_RECHARGE.equals(event.purpose())) {
                return;
            }
            walletService.creditFromPayment(event.userId(), event.paymentTransactionId(), event.amount());
            log.info("Credited wallet recharge for user {} from paymentTransactionId {}", event.userId(), event.paymentTransactionId());
        } catch (Exception ex) {
            log.error("Failed to handle payment.completed payload, skipping: {}", payload, ex);
        }
    }

    private void handlePayoutExecuted(String payload) {
        try {
            PayoutExecutedEvent event = objectMapper.readValue(payload, PayoutExecutedEvent.class);
            boolean paid = PayoutExecutedEvent.STATUS_PAID.equals(event.status());
            payoutService.markPayoutExecuted(event.payoutRequestId(), paid, event.razorpayPayoutId(), event.failureReason());
            log.info("Recorded payout.executed ({}) for payoutRequestId {}", event.status(), event.payoutRequestId());
        } catch (Exception ex) {
            log.error("Failed to handle payout.executed payload, skipping: {}", payload, ex);
        }
    }
}
