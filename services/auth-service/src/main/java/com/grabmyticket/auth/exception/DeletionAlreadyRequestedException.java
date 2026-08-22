package com.grabmyticket.auth.exception;

public class DeletionAlreadyRequestedException extends RuntimeException {
    public DeletionAlreadyRequestedException() {
        super("Account deletion is already pending. Cancel the existing request first if you want to change the scope.");
    }
}
