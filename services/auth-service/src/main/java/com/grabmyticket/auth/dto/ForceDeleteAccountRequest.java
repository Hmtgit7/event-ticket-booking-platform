package com.grabmyticket.auth.dto;

import com.grabmyticket.auth.entity.DeletionScope;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/** Admin-only, bypasses blockers/warnings/grace-period - see AccountDeletionService.forceDelete's class comment for what it can and can't override. reason is required, same convention as SuspendUserRequest, since this is written straight into the audit log. */
public record ForceDeleteAccountRequest(
        @NotNull(message = "scope is required") DeletionScope scope,
        @NotBlank(message = "reason is required") String reason
) {
}
