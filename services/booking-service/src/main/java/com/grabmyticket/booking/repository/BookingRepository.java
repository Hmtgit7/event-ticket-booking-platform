package com.grabmyticket.booking.repository;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.grabmyticket.booking.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    Page<Booking> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    Optional<Booking> findByIdAndUserId(UUID id, UUID userId);

    boolean existsByBookingCode(String bookingCode);

    // ───────────────────────── organizer-facing (Phase 2a) ─────────────────────────
    // Deliberately separate, single-metric queries rather than one consolidated
    // "dashboard summary" - each is meant to be callable independently (e.g. by
    // the AI service later) without paying for metrics the caller didn't ask for.

    Page<Booking> findByOrganizerIdOrderByCreatedAtDesc(UUID organizerId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.organizerId = :organizerId AND b.status = 'CONFIRMED'")
    BigDecimal sumRevenueByOrganizerId(@Param("organizerId") UUID organizerId);

    @Query("SELECT COALESCE(SUM(b.quantity), 0) FROM Booking b WHERE b.organizerId = :organizerId AND b.status = 'CONFIRMED'")
    long sumTicketsSoldByOrganizerId(@Param("organizerId") UUID organizerId);
}
