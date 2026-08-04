package com.grabmyticket.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * currentPassword is intentionally NOT @NotBlank: a Google-only account
 * setting a password for the first time from Settings has none to provide.
 * AuthService.changePassword() enforces it conditionally based on whether
 * the user already has a password_hash.
 */
public record ChangePasswordRequest(
        String currentPassword,

        @NotBlank(message = "New password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        String newPassword
) {
}
