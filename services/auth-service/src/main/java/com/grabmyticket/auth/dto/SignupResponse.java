package com.grabmyticket.auth.dto;

/**
 * POST /auth/signup can no longer promise "always creates a new account":
 * if the email already belongs to a Google-only account, we send a
 * link-password email instead of creating a duplicate or blocking outright.
 * `auth` is populated only when accountCreated = true.
 */
public record SignupResponse(
        boolean accountCreated,
        AuthResponse auth,
        String message
) {
    public static SignupResponse created(AuthResponse auth) {
        return new SignupResponse(true, auth, null);
    }

    public static SignupResponse linkPending(String message) {
        return new SignupResponse(false, null, message);
    }
}
