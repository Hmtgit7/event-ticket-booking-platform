package com.grabmyticket.booking.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.booking.client.EventCatalogClient;
import com.grabmyticket.booking.config.BookingProperties;
import com.grabmyticket.booking.dto.CancellationRequestResponse;
import com.grabmyticket.booking.dto.PageResponse;
import com.grabmyticket.booking.entity.Booking;
import com.grabmyticket.booking.entity.BookingStatus;
import com.grabmyticket.booking.entity.CancellationRequest;
import com.grabmyticket.booking.entity.CancellationStatus;
import com.grabmyticket.booking.entity.TransactionReason;
import com.grabmyticket.booking.entity.Wallet;
import com.grabmyticket.booking.exception.BookingNotFoundException;
import com.grabmyticket.booking.exception.CancellationRequestNotFoundException;
import com.grabmyticket.booking.exception.InvalidCancellationRequestException;
import com.grabmyticket.booking.repository.BookingRepository;
import com.grabmyticket.booking.repository.CancellationRequestRepository;

/**
 * Owns the cancellation request lifecycle: REQUESTED (customer) -> APPROVED
 * (admin, triggers refund) / REJECTED (admin). Refunds are always a wallet
 * credit, never a Razorpay refund call - booking payment already only ever
 * debits the wallet (see BookingService.createBooking), it never charges
 * Razorpay directly, so there's no external gateway transaction to reverse.
 * This is a deliberate consequence of the closed-loop wallet design from
 * the payment-service split, not an oversight.
 */
@Service
@Transactional
public class CancellationService {

    private final CancellationRequestRepository cancellationRequestRepository;
    private final BookingRepository bookingRepository;
    private final WalletService walletService;
    private final EventCatalogClient eventCatalogClient;
    private final BookingProperties bookingProperties;
    private final AuditLogService auditLogService;

    public CancellationService(
            CancellationRequestRepository cancellationRequestRepository,
            BookingRepository bookingRepository,
            WalletService walletService,
            EventCatalogClient eventCatalogClient,
            BookingProperties bookingProperties,
            AuditLogService auditLogService
    ) {
        this.cancellationRequestRepository = cancellationRequestRepository;
        this.bookingRepository = bookingRepository;
        this.walletService = walletService;
        this.eventCatalogClient = eventCatalogClient;
        this.bookingProperties = bookingProperties;
        this.auditLogService = auditLogService;
    }

    public CancellationRequestResponse requestCancellation(UUID userId, UUID bookingId, String reason) {
        Booking booking = bookingRepository.findByIdAndUserId(bookingId, userId)
                .orElseThrow(BookingNotFoundException::new);

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new InvalidCancellationRequestException("Only a confirmed booking can be cancelled");
        }
        if (!booking.getEventStartAt().isAfter(Instant.now())) {
            throw new InvalidCancellationRequestException("This event has already started - cancellation isn't available");
        }
        if (cancellationRequestRepository.existsByBookingIdAndStatus(bookingId, CancellationStatus.REQUESTED)) {
            throw new InvalidCancellationRequestException("A cancellation request for this booking is already pending review");
        }

        CancellationRequest request = cancellationRequestRepository.save(CancellationRequest.builder()
                .bookingId(bookingId)
                .userId(userId)
                .reason(reason)
                .status(CancellationStatus.REQUESTED)
                .build());
        return toResponse(request);
    }

    @Transactional(readOnly = true)
    public PageResponse<CancellationRequestResponse> getMyCancellationRequests(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<CancellationRequest> requests = cancellationRequestRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return PageResponse.of(requests.map(this::toResponse));
    }

    // ───────────────────────── admin review ─────────────────────────

    @Transactional(readOnly = true)
    public PageResponse<CancellationRequestResponse> getPendingCancellationRequests(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        Page<CancellationRequest> requests = cancellationRequestRepository.findByStatusOrderByCreatedAtAsc(CancellationStatus.REQUESTED, pageable);
        return PageResponse.of(requests.map(this::toResponse));
    }

    public CancellationRequestResponse approveCancellation(UUID adminId, UUID cancellationRequestId) {
        CancellationRequest request = getReviewableRequest(cancellationRequestId);
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(BookingNotFoundException::new);

        BigDecimal feeRate = bookingProperties.cancellationFeeRate();
        BigDecimal refundAmount = booking.getTotalAmount().multiply(BigDecimal.ONE.subtract(feeRate));

        Wallet wallet = walletService.getOrCreateWallet(booking.getUserId());
        walletService.credit(
                wallet, refundAmount, TransactionReason.BOOKING_REFUND,
                "Refund for cancelled booking " + booking.getBookingCode(), booking.getId());

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(Instant.now());
        bookingRepository.save(booking);

        // Give the seats back to the pool - best-effort, same as the
        // failed-payment rollback path in BookingService.createBooking.
        eventCatalogClient.releaseSeats(booking.getTicketTypeId(), booking.getQuantity());

        request.setStatus(CancellationStatus.APPROVED);
        request.setRefundAmount(refundAmount);
        request.setReviewedBy(adminId);
        request.setReviewedAt(Instant.now());
        CancellationRequest saved = cancellationRequestRepository.save(request);

        auditLogService.record(adminId, AuditActions.CANCELLATION_APPROVED, AuditActions.TARGET_CANCELLATION_REQUEST, saved.getId(), null);
        return toResponse(saved);
    }

    public CancellationRequestResponse rejectCancellation(UUID adminId, UUID cancellationRequestId, String note) {
        CancellationRequest request = getReviewableRequest(cancellationRequestId);
        request.setStatus(CancellationStatus.REJECTED);
        request.setReviewedBy(adminId);
        request.setReviewNote(note);
        request.setReviewedAt(Instant.now());
        CancellationRequest saved = cancellationRequestRepository.save(request);

        auditLogService.record(adminId, AuditActions.CANCELLATION_REJECTED, AuditActions.TARGET_CANCELLATION_REQUEST, saved.getId(), note);
        return toResponse(saved);
    }

    // ───────────────────────── helpers ─────────────────────────

    private CancellationRequest getReviewableRequest(UUID cancellationRequestId) {
        CancellationRequest request = cancellationRequestRepository.findById(cancellationRequestId)
                .orElseThrow(CancellationRequestNotFoundException::new);
        if (request.getStatus() != CancellationStatus.REQUESTED) {
            throw new InvalidCancellationRequestException(
                    "This cancellation request has already been " + request.getStatus().name().toLowerCase());
        }
        return request;
    }

    private CancellationRequestResponse toResponse(CancellationRequest request) {
        return new CancellationRequestResponse(
                request.getId(),
                request.getBookingId(),
                request.getReason(),
                request.getStatus(),
                request.getRefundAmount(),
                request.getReviewNote(),
                request.getReviewedAt(),
                request.getCreatedAt()
        );
    }
}
