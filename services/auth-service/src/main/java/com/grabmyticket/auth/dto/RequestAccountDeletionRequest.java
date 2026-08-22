package com.grabmyticket.auth.dto;

import com.grabmyticket.auth.entity.DeletionScope;

import jakarta.validation.constraints.NotNull;

/**
 * currentPassword is intentionally NOT @NotBlank, same reasoning as
 * ChangePasswordRequest - a Google-only account has none to provide.
 * acknowledgeWarnings must be true if the eligibility check came back with
 * any warnings (e.g. a forfeitable wallet balance) - otherwise the request
 * is rejected with the same 409 body the eligibility check itself would
 * have returned, forcing the frontend to show the warning and resubmit
 * with explicit consent rather than silently proceeding.
 */
public record RequestAccountDeletionRequest(
        @NotNull(message = "scope is required") DeletionScope scope,
        String currentPassword,
        boolean acknowledgeWarnings
) {
}
