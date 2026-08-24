package com.grabmyticket.event.exception;

/**
 * Thrown by InternalOrganizerDeletionService.cleanupForDeletedOrganizer when
 * a live/upcoming event with tickets sold still exists for this organizer -
 * the last line of defense against ever auto-cancelling a real customer's
 * booking, including when the caller is auth-service's admin force-delete
 * path. Mapped to 409, not 500 - this is an expected business-rule refusal,
 * not a server error.
 */
public class OrganizerStillHasActiveEventsException extends RuntimeException {
    public OrganizerStillHasActiveEventsException(String message) {
        super(message);
    }
}
