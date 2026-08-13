package com.grabmyticket.payment.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import org.json.JSONObject;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.payment.config.PaymentProperties;
import com.grabmyticket.payment.dto.CreateOrderRequest;
import com.grabmyticket.payment.dto.CreateOrderResponse;
import com.grabmyticket.payment.entity.PaymentPurpose;
import com.grabmyticket.payment.entity.PaymentStatus;
import com.grabmyticket.payment.entity.PaymentTransaction;
import com.grabmyticket.payment.event.PaymentCompletedEvent;
import com.grabmyticket.payment.exception.InvalidWebhookSignatureException;
import com.grabmyticket.payment.exception.PaymentNotFoundException;
import com.grabmyticket.payment.repository.PaymentTransactionRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

/**
 * The only class in this service (and in the whole system) that talks to the
 * Razorpay SDK. createOrder() only ever gets this service to CREATED - a
 * PaymentTransaction never becomes COMPLETED except via handleWebhook()
 * after signature verification, because an order being created proves
 * nothing about whether the user actually paid.
 */
@Service
public class RazorpayService {

    private static final BigDecimal PAISE_PER_RUPEE = BigDecimal.valueOf(100);

    private final PaymentTransactionRepository repository;
    private final PaymentProperties properties;
    private final ApplicationEventPublisher eventPublisher;
    private final RazorpayClient razorpayClient;

    public RazorpayService(
            PaymentTransactionRepository repository,
            PaymentProperties properties,
            ApplicationEventPublisher eventPublisher
    ) throws Exception {
        this.repository = repository;
        this.properties = properties;
        this.eventPublisher = eventPublisher;
        this.razorpayClient = new RazorpayClient(properties.razorpay().keyId(), properties.razorpay().keySecret());
    }

    @Transactional
    public CreateOrderResponse createOrder(UUID userId, CreateOrderRequest request) {
        try {
            JSONObject orderRequest = new JSONObject();
            // Razorpay wants the amount in paise (smallest currency unit), not rupees.
            orderRequest.put("amount", request.amount().multiply(PAISE_PER_RUPEE).intValueExact());
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "recharge_" + userId);

            var razorpayOrder = razorpayClient.orders.create(orderRequest);

            PaymentTransaction transaction = PaymentTransaction.builder()
                    .userId(userId)
                    .purpose(PaymentPurpose.WALLET_RECHARGE)
                    .amount(request.amount())
                    .status(PaymentStatus.CREATED)
                    .razorpayOrderId(razorpayOrder.get("id"))
                    .build();
            repository.save(transaction);

            return new CreateOrderResponse(
                    transaction.getRazorpayOrderId(),
                    transaction.getAmount(),
                    transaction.getCurrency(),
                    properties.razorpay().keyId());
        } catch (Exception ex) {
            throw new IllegalStateException("Could not create Razorpay order. Please try again.", ex);
        }
    }

    /**
     * rawBody must be the exact, unparsed request body - Razorpay's HMAC is
     * computed over the raw bytes, so any re-serialization (even
     * whitespace-preserving JSON round-tripping) can produce a signature
     * mismatch. PaymentController is responsible for passing the raw string.
     */
    @Transactional
    public void handleWebhook(String rawBody, String signatureHeader) {
        boolean valid = verifySignature(rawBody, signatureHeader);
        if (!valid) {
            throw new InvalidWebhookSignatureException("Razorpay webhook signature verification failed");
        }

        JSONObject payload = new JSONObject(rawBody);
        String event = payload.getString("event");
        JSONObject paymentEntity = payload.getJSONObject("payload").getJSONObject("payment").getJSONObject("entity");
        String orderId = paymentEntity.getString("order_id");
        String paymentId = paymentEntity.getString("id");

        PaymentTransaction transaction = repository.findByRazorpayOrderId(orderId)
                .orElseThrow(() -> new PaymentNotFoundException("No payment transaction for Razorpay order " + orderId));

        // Idempotency: webhook retries (Razorpay retries on non-2xx, and can
        // occasionally double-deliver regardless) must not re-process an
        // already-COMPLETED transaction or double-publish the Kafka event.
        if (transaction.getStatus() == PaymentStatus.COMPLETED) {
            return;
        }

        if ("payment.captured".equals(event)) {
            transaction.setStatus(PaymentStatus.COMPLETED);
            transaction.setRazorpayPaymentId(paymentId);
            repository.save(transaction);

            eventPublisher.publishEvent(new PaymentCompletedEvent(
                    PaymentCompletedEvent.TYPE,
                    transaction.getId(),
                    transaction.getUserId(),
                    transaction.getPurpose(),
                    transaction.getAmount(),
                    transaction.getCurrency(),
                    paymentId,
                    Instant.now()));
        } else if ("payment.failed".equals(event)) {
            transaction.setStatus(PaymentStatus.FAILED);
            transaction.setFailureReason(paymentEntity.optString("error_description", "Payment failed"));
            repository.save(transaction);
        }
        // Any other event type (refund, dispute, etc.) is intentionally ignored
        // for now - not relevant to WALLET_RECHARGE, will matter once
        // TICKET_PURCHASE/ORGANIZER_PAYOUT purposes are added.
    }

    private boolean verifySignature(String rawBody, String signatureHeader) {
        if (signatureHeader == null || signatureHeader.isBlank()) {
            return false;
        }
        try {
            return Utils.verifyWebhookSignature(rawBody, signatureHeader, properties.razorpay().webhookSecret());
        } catch (Exception ex) {
            return false;
        }
    }
}
