package com.grabmyticket.booking.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.grabmyticket.booking.service.WalletService;

/**
 * Consumes payment-service's payment-events topic. Only acts on
 * eventType=payment.completed with purpose=WALLET_RECHARGE - other
 * eventTypes/purposes (which don't exist yet, but will) are silently
 * ignored rather than erroring, so payment-service can add new event types
 * later without this listener needing a matching change first.
 *
 * Deliberately does NOT throw on a malformed/unrecognized payload - a
 * listener exception here would trigger Spring Kafka's default retry/DLQ
 * behavior against a message this service will never be able to parse,
 * blocking the partition. Logged loudly instead.
 */
@Component
public class PaymentEventListener {

    private static final Logger log = LoggerFactory.getLogger(PaymentEventListener.class);

    private final WalletService walletService;
    private final ObjectMapper objectMapper;

    public PaymentEventListener(WalletService walletService, ObjectMapper objectMapper) {
        this.walletService = walletService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "${app.payment.events-topic}")
    public void onPaymentEvent(String payload) {
        PaymentCompletedEvent event;
        try {
            event = objectMapper.readValue(payload, PaymentCompletedEvent.class);
        } catch (Exception ex) {
            log.error("Failed to deserialize payment event payload, skipping: {}", payload, ex);
            return;
        }

        if (!PaymentCompletedEvent.TYPE.equals(event.eventType())) {
            return;
        }
        if (!PaymentCompletedEvent.PURPOSE_WALLET_RECHARGE.equals(event.purpose())) {
            return;
        }

        walletService.creditFromPayment(event.userId(), event.paymentTransactionId(), event.amount());
        log.info("Credited wallet recharge for user {} from paymentTransactionId {}", event.userId(), event.paymentTransactionId());
    }
}
