package com.grabmyticket.event.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.event.dto.internal.DeletionBlocker;
import com.grabmyticket.event.dto.internal.DeletionCheckResponse;
import com.grabmyticket.event.entity.Event;
import com.grabmyticket.event.entity.EventStatus;
import com.grabmyticket.event.repository.EventRepository;

/**
 * Server-to-server contract for auth-service's account-deletion flow -
 * same "separate service class for a different caller" reasoning as
 * InternalCatalogService, not new branches inside EventService.
 *
 * The core policy: an event only ever blocks organizer profile deletion if
 * it's PUBLISHED, not yet over, AND has at least one real ticket sold -
 * i.e. there's a paying customer relying on it. Events are NEVER hard-deleted
 * here (or anywhere) - that would destroy the platform's own booking/revenue
 * history and strand any customer who still has a confirmed ticket referencing
 * this event. Anything with zero sales (drafts, unpublished-and-forgotten,
 * or published-but-never-booked) is silently swept up as part of teardown
 * instead of blocking the organizer indefinitely over content nobody bought.
 */
@Service
@Transactional
public class InternalOrganizerDeletionService {

    private final EventRepository eventRepository;
    private final AuditLogService auditLogService;

    public InternalOrganizerDeletionService(EventRepository eventRepository, AuditLogService auditLogService) {
        this.eventRepository = eventRepository;
        this.auditLogService = auditLogService;
    }

    /** Pure read, no side effects - safe to call repeatedly throughout the grace period, not just once at request time. */
    @Transactional(readOnly = true)
    public DeletionCheckResponse checkDeletionEligibility(UUID organizerId) {
        Instant now = Instant.now();
        List<Event> soldAndActive = eventRepository.findSoldAndActive(organizerId, EventStatus.PUBLISHED, now);

        if (soldAndActive.isEmpty()) {
            return DeletionCheckResponse.noBlockers();
        }

        long live = soldAndActive.stream().filter(e -> !e.getStartAt().isAfter(now)).count();
        long upcoming = soldAndActive.size() - live;

        List<DeletionBlocker> blockers = new ArrayList<>();
        if (live > 0) {
            blockers.add(new DeletionBlocker(
                    "EVENT_LIVE",
                    "You have " + live + " event" + (live == 1 ? "" : "s") + " currently live with tickets sold",
                    (int) live));
        }
        if (upcoming > 0) {
            blockers.add(new DeletionBlocker(
                    "EVENT_UPCOMING",
                    "You have " + upcoming + " upcoming event" + (upcoming == 1 ? "" : "s") + " with tickets sold",
                    (int) upcoming));
        }
        return DeletionCheckResponse.blockedBy(blockers);
    }

    /**
     * Mutating cleanup, called by auth-service only once it's actually finalizing
     * an organizer profile deletion (grace period elapsed, eligibility re-confirmed).
     * Never called speculatively during the grace period. Defensive by design: if
     * a sold/active event somehow still exists (a race with a booking made during
     * the grace period), this refuses outright rather than silently cancelling a
     * paid ticket - the caller's re-check before finalizing should already prevent
     * this, but this is the last line of defense against ever auto-cancelling a
     * real customer's booking.
     */
    public void cleanupForDeletedOrganizer(UUID organizerId) {
        Instant now = Instant.now();
        if (!eventRepository.findSoldAndActive(organizerId, EventStatus.PUBLISHED, now).isEmpty()) {
            throw new IllegalStateException(
                    "Refusing to clean up organizer " + organizerId + " - still has live/upcoming events with tickets sold");
        }

        for (Event draft : eventRepository.findByOrganizerIdAndStatus(organizerId, EventStatus.DRAFT)) {
            draft.setStatus(EventStatus.ARCHIVED);
            eventRepository.save(draft);
            auditLogService.record(organizerId, AuditActions.EVENT_ARCHIVED_ON_ACCOUNT_DELETION, AuditActions.TARGET_EVENT, draft.getId(), "Organizer profile deleted - draft never published");
        }

        for (Event unsold : eventRepository.findUnsoldByOrganizerIdAndStatus(organizerId, EventStatus.PUBLISHED)) {
            unsold.setStatus(EventStatus.CANCELLED);
            eventRepository.save(unsold);
            auditLogService.record(organizerId, AuditActions.EVENT_CANCELLED_ON_ACCOUNT_DELETION, AuditActions.TARGET_EVENT, unsold.getId(), "Organizer profile deleted - event never sold any tickets");
        }
    }
}
