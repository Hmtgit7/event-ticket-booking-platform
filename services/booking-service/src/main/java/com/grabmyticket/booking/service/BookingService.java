package com.grabmyticket.booking.service;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.booking.client.EventCatalogClient;
import com.grabmyticket.booking.client.TicketTypeSnapshot;
import com.grabmyticket.booking.dto.BookingResponse;
import com.grabmyticket.booking.dto.CreateBookingRequest;
import com.grabmyticket.booking.dto.PageResponse;
import com.grabmyticket.booking.entity.Booking;
import com.grabmyticket.booking.entity.BookingStatus;
import com.grabmyticket.booking.entity.TransactionReason;
import com.grabmyticket.booking.entity.Wallet;
import com.grabmyticket.booking.exception.BookingNotFoundException;
import com.grabmyticket.booking.exception.EventNotBookableException;
import com.grabmyticket.booking.exception.InsufficientBalanceException;
import com.grabmyticket.booking.exception.SeatsUnavailableException;
import com.grabmyticket.booking.exception.TicketTypeNotFoundException;
import com.grabmyticket.booking.repository.BookingRepository;

/**
 * Orchestrates a booking: reserve seats on event-service, then debit the
 * wallet. Reserve happens first - a lost race on seats is cheap to reject
 * outright, but a wallet debit that then can't get seats would mean refunding
 * money we just took, which is the worse failure mode to design around.
 */
@Service
@Transactional
public class BookingService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    private final BookingRepository bookingRepository;
    private final EventCatalogClient eventCatalogClient;
    private final WalletService walletService;

    public BookingService(BookingRepository bookingRepository, EventCatalogClient eventCatalogClient, WalletService walletService) {
        this.bookingRepository = bookingRepository;
        this.eventCatalogClient = eventCatalogClient;
        this.walletService = walletService;
    }

    public BookingResponse createBooking(UUID userId, CreateBookingRequest request) {
        TicketTypeSnapshot snapshot = eventCatalogClient.getSnapshot(request.ticketTypeId());
        validateBookable(snapshot, request);

        BigDecimal totalAmount = snapshot.price().multiply(BigDecimal.valueOf(request.quantity()));

        eventCatalogClient.reserveSeats(request.ticketTypeId(), request.quantity());

        Booking booking = bookingRepository.save(Booking.builder()
                .bookingCode(generateUniqueBookingCode())
                .userId(userId)
                .eventId(snapshot.eventId())
                .ticketTypeId(request.ticketTypeId())
                .eventTitle(snapshot.eventTitle())
                .eventStartAt(snapshot.eventStartAt())
                .eventBannerUrl(snapshot.eventBannerUrl())
                .ticketTypeName(snapshot.ticketTypeName())
                .quantity(request.quantity())
                .unitPrice(snapshot.price())
                .totalAmount(totalAmount)
                .status(BookingStatus.PENDING)
                .build());

        try {
            Wallet wallet = walletService.getOrCreateWallet(userId);
            walletService.debit(
                    wallet, totalAmount, TransactionReason.BOOKING_PAYMENT,
                    "Payment for " + snapshot.eventTitle(), booking.getId());
        } catch (InsufficientBalanceException ex) {
            eventCatalogClient.releaseSeats(request.ticketTypeId(), request.quantity());
            booking.setStatus(BookingStatus.FAILED);
            bookingRepository.save(booking);
            throw ex;
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        return toResponse(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public PageResponse<BookingResponse> getMyBookings(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return PageResponse.of(bookings.map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public BookingResponse getMyBooking(UUID userId, UUID bookingId) {
        Booking booking = bookingRepository.findByIdAndUserId(bookingId, userId)
                .orElseThrow(BookingNotFoundException::new);
        return toResponse(booking);
    }

    // ───────────────────────── helpers ─────────────────────────

    private void validateBookable(TicketTypeSnapshot snapshot, CreateBookingRequest request) {
        if (!snapshot.eventId().equals(request.eventId())) {
            throw new TicketTypeNotFoundException();
        }
        if (!"PUBLISHED".equals(snapshot.eventStatus())) {
            throw new EventNotBookableException("This event isn't open for booking");
        }
        Instant now = Instant.now();
        if (snapshot.salesStart() != null && now.isBefore(snapshot.salesStart())) {
            throw new EventNotBookableException("Ticket sales haven't started yet");
        }
        if (snapshot.salesEnd() != null && now.isAfter(snapshot.salesEnd())) {
            throw new EventNotBookableException("Ticket sales have closed for this event");
        }
        if (snapshot.quantityAvailable() < request.quantity()) {
            throw new SeatsUnavailableException();
        }
    }

    private String generateUniqueBookingCode() {
        String candidate;
        do {
            candidate = "GMT-" + randomSuffix();
        } while (bookingRepository.existsByBookingCode(candidate));
        return candidate;
    }

    private String randomSuffix() {
        StringBuilder sb = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            sb.append(CODE_CHARS.charAt(RANDOM.nextInt(CODE_CHARS.length())));
        }
        return sb.toString();
    }

    private BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getBookingCode(),
                booking.getEventId(),
                booking.getTicketTypeId(),
                booking.getEventTitle(),
                booking.getEventStartAt(),
                booking.getEventBannerUrl(),
                booking.getTicketTypeName(),
                booking.getQuantity(),
                booking.getUnitPrice(),
                booking.getTotalAmount(),
                booking.getStatus(),
                booking.getCancelledAt(),
                booking.getCreatedAt()
        );
    }
}
