package com.grabmyticket.auth.exception;

/** Thrown from login/google-login/refresh for a suspended account - never from any self-service flow, only AdminUserService.suspendUser sets the state that causes this. */
public class SuspendedAccountException extends RuntimeException {
    public SuspendedAccountException(String message) {
        super(message);
    }
}
