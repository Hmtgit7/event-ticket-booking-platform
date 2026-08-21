package com.grabmyticket.booking.service;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
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
import com.grabmyticket.booking.dto.OrganizerRevenueResponse;
import com.grabmyticket.booking.dto.OrganizerTicketsSoldResponse;
import com.grabmyticket.booking.dto.PageResponse;
import com.grabmyticket.booking.entity.Booking;
import com.grabmyticket.booking.entity.BookingStatus;
import com.grabmyticket.booking.entity.TransactionReason;
import com.grabmyticket.booking.entity.Wallet;
import com.grabmyticket.booking.event.BookingConfirmedEvent;
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
    private final ApplicationEventPublisher applicationEventPublisher;

    public BookingService(
            BookingRepository bookingRepository,
            EventCatalogClient eventCatalogClient,
            WalletService walletService,
            ApplicationEventPublisher applicationEventPublisher
    ) {
        this.bookingRepository = bookingRepository;
        this.eventCatalogClient = eventCatalogClient;
        this.walletService = walletService;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    public BookingResponse createBooking(UUID userId, String userEmail, CreateBookingRequest request) {
        TicketTypeSnapshot snapshot = eventCatalogClient.getSnapshot(request.ticketTypeId());
        validateBookable(snapshot, request);

        BigDecimal totalAmount = snapshot.price().multiply(BigDecimal.valueOf(request.quantity()));

        eventCatalogClient.reserveSeats(request.ticketTypeId(), request.quantity());

        Booking booking = bookingRepository.save(Booking.builder()
                .bookingCode(generateUniqueBookingCode())
                .userId(userId)
                .eventId(snapshot.eventId())
                .organizerId(snapshot.organizerId())
                .ticketTypeId(request.ticketTypeId())
                .eventTitle(snapshot.eventTitle())
                .eventStartAt(snapshot.eventStartAt())
                .eventBannerUrl(snapshot.eventBannerUrl())
                .ticketTypeName(snapshot.ticketTypeName())
                .venueName(snapshot.venueName())
                .address(snapshot.address())
                .city(snapshot.city())
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
        Booking confirmed = bookingRepository.save(booking);
        applicationEventPublisher.publishEvent(toConfirmedEvent(confirmed, userEmail, snapshot.organizerId()));
        return toResponse(confirmed);
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

    // Organizer-facing (Phase 2a) - deliberately separate, single-metric methods
    // rather than one consolidated "dashboard summary", so each is independently
    // callable (e.g. by the AI service later) without paying for unused metrics.

    @Transactional(readOnly = true)
    public PageResponse<BookingResponse> getOrganizerBookings(UUID organizerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Booking> bookings = bookingRepository.findByOrganizerIdOrderByCreatedAtDesc(organizerId, pageable);
        return PageResponse.of(bookings.map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public OrganizerRevenueResponse getOrganizerRevenue(UUID organizerId) {
        return new OrganizerRevenueResponse(bookingRepository.sumRevenueByOrganizerId(organizerId), "INR");
    }

    @Transactional(readOnly = true)
    public OrganizerTicketsSoldResponse getOrganizerTicketsSold(UUID organizerId) {
        return new OrganizerTicketsSoldResponse(bookingRepository.sumTicketsSoldByOrganizerId(organizerId));
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

    private BookingConfirmedEvent toConfirmedEvent(Booking booking, String userEmail, UUID organizerId) {
        return new BookingConfirmedEvent(
                BookingConfirmedEvent.TYPE,
                booking.getId(),
                booking.getBookingCode(),
                booking.getUserId(),
                userEmail,
                booking.getEventId(),
                organizerId,
                booking.getEventTitle(),
                booking.getEventStartAt(),
                booking.getEventBannerUrl(),
                booking.getTicketTypeName(),
                booking.getVenueName(),
                booking.getAddress(),
                booking.getCity(),
                booking.getQuantity(),
                booking.getTotalAmount(),
                Instant.now()
        );
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
