package com.grabmyticket.booking.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.booking.config.BookingProperties;
import com.grabmyticket.booking.dto.AvailableBalanceResponse;
import com.grabmyticket.booking.dto.PayoutRequestResponse;
import com.grabmyticket.booking.entity.PayoutRequest;
import com.grabmyticket.booking.entity.PayoutStatus;
import com.grabmyticket.booking.event.PayoutApprovedEvent;
import com.grabmyticket.booking.exception.InsufficientPayoutBalanceException;
import com.grabmyticket.booking.exception.PayoutRequestNotFoundException;
import com.grabmyticket.booking.exception.PayoutRequestNotReviewableException;
import com.grabmyticket.booking.dto.PageResponse;
import com.grabmyticket.booking.repository.BookingRepository;
import com.grabmyticket.booking.repository.PayoutRequestRepository;

/**
 * Owns the organizer payout request lifecycle: REQUESTED (organizer) ->
 * APPROVED/REJECTED (admin) -> PAID/FAILED (payment-service, via Kafka,
 * once Phase 2c's consumer exists). This service never calls Razorpay
 * itself - approvePayout() only flips status and publishes
 * PayoutApprovedEvent; payment-service is what actually moves money.
 */
@Service
@Transactional
public class PayoutService {

    // REQUESTED+APPROVED are "reserved" (not yet paid, but committed against
    // the balance so a second request can't double-spend the same revenue).
    // PAID is already gone. Both count against availableBalance.
    private static final List<PayoutStatus> COMMITTED_STATUSES = List.of(
            PayoutStatus.REQUESTED, PayoutStatus.APPROVED, PayoutStatus.PAID);

    private final PayoutRequestRepository payoutRequestRepository;
    private final BookingRepository bookingRepository;
    private final BookingProperties bookingProperties;
    private final ApplicationEventPublisher applicationEventPublisher;

    public PayoutService(
            PayoutRequestRepository payoutRequestRepository,
            BookingRepository bookingRepository,
            BookingProperties bookingProperties,
            ApplicationEventPublisher applicationEventPublisher
    ) {
        this.payoutRequestRepository = payoutRequestRepository;
        this.bookingRepository = bookingRepository;
        this.bookingProperties = bookingProperties;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    @Transactional(readOnly = true)
    public AvailableBalanceResponse getAvailableBalance(UUID organizerId) {
        BigDecimal grossRevenue = bookingRepository.sumRevenueByOrganizerId(organizerId);
        BigDecimal commissionRate = bookingProperties.platformCommissionRate();
        BigDecimal netEarnings = grossRevenue.multiply(BigDecimal.ONE.subtract(commissionRate));
        BigDecimal alreadyCommitted = payoutRequestRepository.sumAmountByOrganizerIdAndStatusIn(organizerId, COMMITTED_STATUSES);
        BigDecimal availableBalance = netEarnings.subtract(alreadyCommitted).max(BigDecimal.ZERO);
        return new AvailableBalanceResponse(grossRevenue, commissionRate, availableBalance, "INR");
    }

    public PayoutRequestResponse requestPayout(UUID organizerId, BigDecimal amount) {
        AvailableBalanceResponse balance = getAvailableBalance(organizerId);
        if (amount.compareTo(balance.availableBalance()) > 0) {
            throw new InsufficientPayoutBalanceException(
                    "Requested amount exceeds your available balance of ₹" + balance.availableBalance());
        }

        PayoutRequest request = payoutRequestRepository.save(PayoutRequest.builder()
                .organizerId(organizerId)
                .amount(amount)
                .status(PayoutStatus.REQUESTED)
                .build());
        return toResponse(request);
    }

    @Transactional(readOnly = true)
    public PageResponse<PayoutRequestResponse> getMyPayoutRequests(UUID organizerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<PayoutRequest> requests = payoutRequestRepository.findByOrganizerIdOrderByCreatedAtDesc(organizerId, pageable);
        return PageResponse.of(requests.map(this::toResponse));
    }

    // ───────────────────────── admin review (backend-ready for Phase 7's UI) ─────────────────────────

    @Transactional(readOnly = true)
    public PageResponse<PayoutRequestResponse> getPendingPayoutRequests(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        Page<PayoutRequest> requests = payoutRequestRepository.findByStatusOrderByCreatedAtAsc(PayoutStatus.REQUESTED, pageable);
        return PageResponse.of(requests.map(this::toResponse));
    }

    public PayoutRequestResponse approvePayoutRequest(UUID payoutRequestId, UUID adminId) {
        PayoutRequest request = getReviewableRequest(payoutRequestId);
        request.setStatus(PayoutStatus.APPROVED);
        request.setReviewedBy(adminId);
        request.setReviewedAt(Instant.now());
        PayoutRequest saved = payoutRequestRepository.save(request);

        applicationEventPublisher.publishEvent(new PayoutApprovedEvent(
                PayoutApprovedEvent.TYPE, saved.getId(), saved.getOrganizerId(), saved.getAmount(), Instant.now()));
        return toResponse(saved);
    }

    public PayoutRequestResponse rejectPayoutRequest(UUID payoutRequestId, UUID adminId, String note) {
        PayoutRequest request = getReviewableRequest(payoutRequestId);
        request.setStatus(PayoutStatus.REJECTED);
        request.setReviewedBy(adminId);
        request.setReviewNote(note);
        request.setReviewedAt(Instant.now());
        return toResponse(payoutRequestRepository.save(request));
    }

    // ─────────────────────── payment-service callback (Phase 2c-ii) ───────────────────────

    /**
     * Called by PayoutEventListener once payment-service confirms (via
     * payout.executed) whether the Razorpay transfer actually went through.
     * Idempotent - a redelivered event for an already-PAID/FAILED request is
     * a no-op, same guard style as WalletService.creditFromPayment.
     */
    public void markPayoutExecuted(UUID payoutRequestId, boolean paid, String razorpayPayoutId, String failureReason) {
        PayoutRequest request = payoutRequestRepository.findById(payoutRequestId).orElse(null);
        if (request == null) {
            return;
        }
        if (request.getStatus() == PayoutStatus.PAID || request.getStatus() == PayoutStatus.FAILED) {
            return;
        }

        request.setStatus(paid ? PayoutStatus.PAID : PayoutStatus.FAILED);
        request.setRazorpayPayoutId(razorpayPayoutId);
        if (!paid && request.getReviewNote() == null) {
            // reviewNote is otherwise an admin's rejection reason - reused
            // here only because this request was never rejected by an admin
            // (it was APPROVED, then failed downstream at Razorpay), so
            // there's no conflict with an actual admin note.
            request.setReviewNote(failureReason);
        }
        payoutRequestRepository.save(request);
    }

    // ───────────────────────── helpers ─────────────────────────

    private PayoutRequest getReviewableRequest(UUID payoutRequestId) {
        PayoutRequest request = payoutRequestRepository.findById(payoutRequestId)
                .orElseThrow(PayoutRequestNotFoundException::new);
        if (request.getStatus() != PayoutStatus.REQUESTED) {
            throw new PayoutRequestNotReviewableException(
                    "This payout request has already been " + request.getStatus().name().toLowerCase());
        }
        return request;
    }

    private PayoutRequestResponse toResponse(PayoutRequest request) {
        return new PayoutRequestResponse(
                request.getId(),
                request.getOrganizerId(),
                request.getAmount(),
                request.getStatus(),
                request.getReviewNote(),
                request.getReviewedAt(),
                request.getCreatedAt()
        );
    }
}
