package com.grabmyticket.event.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.grabmyticket.event.entity.Event;
import com.grabmyticket.event.entity.EventStatus;

public interface EventRepository extends JpaRepository<Event, UUID>, JpaSpecificationExecutor<Event> {

    boolean existsBySlug(String slug);

    Optional<Event> findBySlug(String slug);

    Optional<Event> findByIdAndOrganizerId(UUID id, UUID organizerId);

    Page<Event> findByOrganizerId(UUID organizerId, Pageable pageable);

    // ───────────────────────── Phase 9: account deletion ─────────────────────────

    /**
     * PUBLISHED events currently live/upcoming for this organizer that have at
     * least one ticket sold (quantity_available < quantity_total on any tier) -
     * see InternalOrganizerDeletionService's class comment for why an event
     * with zero sales is never a blocker (it gets auto-cancelled/archived
     * instead, not protected). "Live" = startAt <= now <= endAt; "upcoming" =
     * startAt > now; this single query covers both by only requiring endAt >= now.
     */
    @Query("select distinct e from Event e join e.ticketTypes t "
            + "where e.organizerId = :organizerId and e.status = :status "
            + "and e.endAt >= :now and t.quantityAvailable < t.quantityTotal")
    List<Event> findSoldAndActive(@Param("organizerId") UUID organizerId, @Param("status") EventStatus status, @Param("now") Instant now);

    /** DRAFT events with no ticket sales possible (drafts can't be booked) - safe to auto-archive wholesale during organizer profile teardown. */
    List<Event> findByOrganizerIdAndStatus(UUID organizerId, EventStatus status);

    /** PUBLISHED events for this organizer that never sold a single ticket - safe to auto-cancel during organizer profile teardown (nobody to notify, nothing to refund). */
    @Query("select e from Event e where e.organizerId = :organizerId and e.status = :status "
            + "and not exists (select 1 from TicketType t where t.event = e and t.quantityAvailable < t.quantityTotal)")
    List<Event> findUnsoldByOrganizerIdAndStatus(@Param("organizerId") UUID organizerId, @Param("status") EventStatus status);
}
