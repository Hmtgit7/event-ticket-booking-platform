package com.grabmyticket.booking.repository;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.grabmyticket.booking.entity.RelatedEntityType;
import com.grabmyticket.booking.entity.SupportTicket;
import com.grabmyticket.booking.entity.SupportTicketStatus;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, UUID> {

    Page<SupportTicket> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    Optional<SupportTicket> findByIdAndUserId(UUID id, UUID userId);

    Page<SupportTicket> findByStatusOrderByCreatedAtDesc(SupportTicketStatus status, Pageable pageable);

    Page<SupportTicket> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // ───────────────────────── Phase 9: account deletion ─────────────────────────

    /**
     * C4/O5 - open/in-progress tickets this user raised that are relevant to
     * the profile scope being deleted. relatedEntityType null (a general
     * issue with nothing specific linked) is deliberately included via the
     * OR clause on BOTH the customer and organizer call sites - an
     * unclassified ticket is treated as relevant to either scope rather
     * than silently ignored, since there's no safe way to tell which
     * persona it's actually about.
     */
    @Query("select count(t) from SupportTicket t where t.userId = :userId and t.status in :statuses "
            + "and (t.relatedEntityType in :types or t.relatedEntityType is null)")
    long countOpenByUserIdAndRelatedTypes(
            @Param("userId") UUID userId,
            @Param("statuses") Collection<SupportTicketStatus> statuses,
            @Param("types") Collection<RelatedEntityType> types);
}
