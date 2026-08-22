package com.grabmyticket.event.entity;

/**
 * FLAGGED and REMOVED are admin-moderation states, not organizer-lifecycle
 * ones - deliberately reusing this single enum (rather than a parallel
 * "flagged" boolean) so the existing PUBLISHED-only filters in
 * EventSpecifications/getPublicEventBySlug automatically exclude flagged
 * and removed events from public view with zero query changes. An event can
 * only be flagged/removed from PUBLISHED (nothing else is publicly visible
 * to begin with); unflag/restore always return it to PUBLISHED.
 *
 * ARCHIVED is a third, separate kind of terminal state: self-service cleanup
 * only, set automatically (never by an organizer or admin action directly)
 * when an organizer deletes their profile and this event never had any
 * tickets sold - see InternalOrganizerCleanupService. Deliberately distinct
 * from REMOVED (admin moderation) and CANCELLED (implies the event was
 * going to happen and got called off, which isn't true for an unpublished
 * draft that never had a real audience).
 */
public enum EventStatus {
    DRAFT,
    PUBLISHED,
    CANCELLED,
    COMPLETED,
    FLAGGED,
    REMOVED,
    ARCHIVED
}
