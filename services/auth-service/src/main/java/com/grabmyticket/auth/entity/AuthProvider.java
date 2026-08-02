package com.grabmyticket.auth.entity;

/**
 * How the user's identity was established.
 * LOCAL  -> signed up with email + password, must verify email.
 * GOOGLE -> signed up/logged in via Google OAuth2; email is trusted as already verified.
 */
public enum AuthProvider {
    LOCAL,
    GOOGLE
}
