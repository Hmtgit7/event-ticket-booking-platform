package com.grabmyticket.auth.exception;

public class NoDeletionRequestException extends RuntimeException {
    public NoDeletionRequestException() {
        super("There's no pending deletion request to cancel.");
    }
}
