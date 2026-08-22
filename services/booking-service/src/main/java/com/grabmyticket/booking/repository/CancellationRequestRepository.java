package com.grabmyticket.booking.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.grabmyticket.booking.entity.CancellationRequest;
import com.grabmyticket.booking.entity.CancellationStatus;

public interface CancellationRequestRepository extends JpaRepository<CancellationRequest, UUID> {

    boolean existsByBookingIdAndStatus(UUID bookingId, CancellationStatus status);

    Page<CancellationRequest> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    Page<CancellationRequest> findByStatusOrderByCreatedAtAsc(CancellationStatus status, Pageable pageable);

    Optional<CancellationRequest> findByIdAndUserId(UUID id, UUID userId);

    // ───────────────────────── Phase 9: account deletion ─────────────────────────

    /** C2 - a refund decision an admin hasn't made yet; deletion must wait until it resolves either way. */
    long countByUserIdAndStatus(UUID userId, CancellationStatus status);
}
