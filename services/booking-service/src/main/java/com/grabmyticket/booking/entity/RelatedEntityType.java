package com.grabmyticket.booking.entity;

/**
 * What this ticket is about, if anything specific - a booking, a payout
 * request, a cancellation request. Null for general/account-level issues
 * with nothing to link to. Kept as a loose (type, id) pair rather than
 * three separate nullable FK-style columns, same reasoning as
 * AdminAuditLog's targetType/targetId: one new relatable entity type later
 * never needs a schema change.
 */
public enum RelatedEntityType {
    BOOKING,
    PAYOUT_REQUEST,
    CANCELLATION_REQUEST
}
