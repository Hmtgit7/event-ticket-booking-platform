package com.grabmyticket.auth.exception;

/**
 * Thrown when event-service refuses cleanup because a live/upcoming event
 * with tickets sold still exists - deliberately NOT bypassable even by
 * AdminUserService.forceDelete, since it's a data-integrity/money-movement
 * protection, not a "waiting on the user" blocker. Distinct from
 * AccountDeletionServiceUnavailableException, which means "couldn't reach
 * the service at all" - this means "reached it, and it said no".
 */
public class ForceDeleteBlockedException extends RuntimeException {
    public ForceDeleteBlockedException(String message) {
        super(message);
    }
}
