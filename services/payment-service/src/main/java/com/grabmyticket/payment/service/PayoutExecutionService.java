package com.grabmyticket.payment.service;

import java.math.BigDecimal;
import java.time.Instant;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.payment.config.PaymentProperties;
import com.grabmyticket.payment.entity.OrganizerPayoutAccount;
import com.grabmyticket.payment.entity.PayoutAccountStatus;
import com.grabmyticket.payment.entity.PayoutTransaction;
import com.grabmyticket.payment.entity.PayoutTransactionStatus;
import com.grabmyticket.payment.event.PayoutApprovedEvent;
import com.grabmyticket.payment.event.PayoutExecutedEvent;
import com.grabmyticket.payment.repository.OrganizerPayoutAccountRepository;
import com.grabmyticket.payment.repository.PayoutTransactionRepository;

/**
 * Consumes booking-service's payout.approved (via PayoutEventListener) and
 * is the only place in the system that actually calls Razorpay's Payout
 * API. Always ends in a terminal PayoutExecutedEvent (PAID or FAILED) -
 * booking-service's PayoutRequest is left in APPROVED forever otherwise, so
 * every code path here, including expected failures (no payout account,
 * Razorpay rejection), must still publish something.
 */
@Service
@Transactional
public class PayoutExecutionService {

    private static final Logger log = LoggerFactory.getLogger(PayoutExecutionService.class);
    private static final BigDecimal PAISE_PER_RUPEE = BigDecimal.valueOf(100);

    private final PayoutTransactionRepository payoutTransactionRepository;
    private final OrganizerPayoutAccountRepository payoutAccountRepository;
    private final RazorpayXClient razorpayXClient;
    private final PaymentProperties properties;
    private final ApplicationEventPublisher applicationEventPublisher;

    public PayoutExecutionService(
            PayoutTransactionRepository payoutTransactionRepository,
            OrganizerPayoutAccountRepository payoutAccountRepository,
            RazorpayXClient razorpayXClient,
            PaymentProperties properties,
            ApplicationEventPublisher applicationEventPublisher
    ) {
        this.payoutTransactionRepository = payoutTransactionRepository;
        this.payoutAccountRepository = payoutAccountRepository;
        this.razorpayXClient = razorpayXClient;
        this.properties = properties;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    public void execute(PayoutApprovedEvent event) {
        if (payoutTransactionRepository.existsByPayoutRequestId(event.payoutRequestId())) {
            log.info("Ignoring duplicate payout.approved for payoutRequestId {} - already processed", event.payoutRequestId());
            return;
        }

        PayoutTransaction transaction = PayoutTransaction.builder()
                .payoutRequestId(event.payoutRequestId())
                .organizerId(event.organizerId())
                .amount(event.amount())
                .status(PayoutTransactionStatus.INITIATED)
                .build();

        var payoutAccount = payoutAccountRepository.findByOrganizerId(event.organizerId()).orElse(null);
        if (payoutAccount == null || payoutAccount.getStatus() != PayoutAccountStatus.ACTIVE) {
            fail(transaction, event, "Organizer has no verified payout account on file");
            return;
        }

        try {
            JSONObject payout = razorpayXClient.createPayout(
                    properties.razorpayX().accountNumber(),
                    payoutAccount.getRazorpayFundAccountId(),
                    event.amount().multiply(PAISE_PER_RUPEE).longValueExact(),
                    properties.razorpayX().payoutMode(),
                    properties.razorpayX().payoutPurpose(),
                    event.payoutRequestId().toString(),
                    event.payoutRequestId().toString());

            String razorpayPayoutId = payout.getString("id");
            String payoutStatus = payout.optString("status", "");

            // Razorpay Payouts can come back "processing"/"queued" rather
            // than an immediate terminal state (e.g. low balance queuing,
            // or NEFT batching) - treated as COMPLETED here since the
            // transfer has been accepted and is Razorpay's problem to
            // deliver from this point; a "failed"/"rejected"/"reversed"
            // status is the only case treated as an outright failure.
            // Reconciling a later async reversal isn't handled yet - flagged
            // for whenever Razorpay's payout webhook gets wired up.
            boolean failed = "failed".equalsIgnoreCase(payoutStatus) || "rejected".equalsIgnoreCase(payoutStatus)
                    || "reversed".equalsIgnoreCase(payoutStatus);

            if (failed) {
                transaction.setRazorpayPayoutId(razorpayPayoutId);
                fail(transaction, event, "Razorpay reported payout status: " + payoutStatus);
                return;
            }

            transaction.setStatus(PayoutTransactionStatus.COMPLETED);
            transaction.setRazorpayPayoutId(razorpayPayoutId);
            payoutTransactionRepository.save(transaction);

            applicationEventPublisher.publishEvent(new PayoutExecutedEvent(
                    PayoutExecutedEvent.TYPE, event.payoutRequestId(), event.organizerId(), event.amount(),
                    PayoutExecutedEvent.STATUS_PAID, razorpayPayoutId, null, Instant.now()));
        } catch (RazorpayXException ex) {
            fail(transaction, event, ex.getMessage());
        }
    }

    private void fail(PayoutTransaction transaction, PayoutApprovedEvent event, String reason) {
        transaction.setStatus(PayoutTransactionStatus.FAILED);
        transaction.setFailureReason(reason);
        payoutTransactionRepository.save(transaction);

        applicationEventPublisher.publishEvent(new PayoutExecutedEvent(
                PayoutExecutedEvent.TYPE, event.payoutRequestId(), event.organizerId(), event.amount(),
                PayoutExecutedEvent.STATUS_FAILED, transaction.getRazorpayPayoutId(), reason, Instant.now()));
    }
}
