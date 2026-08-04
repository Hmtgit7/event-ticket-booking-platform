package com.grabmyticket.auth.entity;

/**
 * Describes why a {@link VerificationToken} was issued.
 *
 * <ul>
 *   <li>{@link #VERIFY_EMAIL}   – sent after local sign-up to confirm the address</li>
 *   <li>{@link #LINK_PASSWORD}  – sent when a password sign-up collides with an existing OAuth account</li>
 *   <li>{@link #RESET_PASSWORD} – sent via the forgot-password flow</li>
 * </ul>
 */
public enum TokenPurpose {
    VERIFY_EMAIL,
    LINK_PASSWORD,
    RESET_PASSWORD
}
