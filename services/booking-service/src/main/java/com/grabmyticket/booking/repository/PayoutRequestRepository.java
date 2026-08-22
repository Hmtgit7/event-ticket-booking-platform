package com.grabmyticket.booking.repository;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.grabmyticket.booking.entity.PayoutRequest;
import com.grabmyticket.booking.entity.PayoutStatus;

public interface PayoutRequestRepository extends JpaRepository<PayoutRequest, UUID> {

    Page<PayoutRequest> findByOrganizerIdOrderByCreatedAtDesc(UUID organizerId, Pageable pageable);

    Optional<PayoutRequest> findByIdAndOrganizerId(UUID id, UUID organizerId);

    Page<PayoutRequest> findByStatusOrderByCreatedAtAsc(PayoutStatus status, Pageable pageable);

    /** Sum of everything already committed against this organizer's balance - REQUESTED/APPROVED (not yet paid, but reserved) and PAID (already sent). REJECTED/FAILED excluded, since those never held funds or gave them back. */
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM PayoutRequest p WHERE p.organizerId = :organizerId AND p.status IN :statuses")
    BigDecimal sumAmountByOrganizerIdAndStatusIn(@Param("organizerId") UUID organizerId, @Param("statuses") Collection<PayoutStatus> statuses);

    // ───────────────────────── Phase 9: account deletion ─────────────────────────

    /** O3 - payout requests still mid-flight (money in motion, decision not yet final). */
    long countByOrganizerIdAndStatusIn(UUID organizerId, Collection<PayoutStatus> statuses);
}
