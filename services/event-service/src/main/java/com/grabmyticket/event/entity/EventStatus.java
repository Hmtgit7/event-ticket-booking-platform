package com.grabmyticket.event.entity;

/**
 * FLAGGED and REMOVED are admin-moderation states, not organizer-lifecycle
 * ones - deliberately reusing this single enum (rather than a parallel
 * "flagged" boolean) so the existing PUBLISHED-only filters in
 * EventSpecifications/getPublicEventBySlug automatically exclude flagged
 * and removed events from public view with zero query changes. An event can
 * only be flagged/removed from PUBLISHED (nothing else is publicly visible
 * to begin with); unflag/restore always return it to PUBLISHED.
 */
public enum EventStatus {
    DRAFT,
    PUBLISHED,
    CANCELLED,
    COMPLETED,
    FLAGGED,
    REMOVED
}
