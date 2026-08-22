package com.grabmyticket.auth.exception;

/** Thrown when booking-service or event-service can't be reached during an account-deletion eligibility check or finalization step. Mirrors booking-service's EventServiceUnavailableException. */
public class AccountDeletionServiceUnavailableException extends RuntimeException {
    public AccountDeletionServiceUnavailableException(String message) {
        super(message);
    }
}
