package com.grabmyticket.auth.dto;

import java.time.Instant;

public record ErrorResponse(
        Instant timestamp,
        int status,
        String error,
        String message,
        /** Stable machine-readable identifier for cases the frontend needs to branch on
         *  (e.g. "EMAIL_NOT_VERIFIED") - null for everything else. Prefer this over
         *  matching on `message` text, which is free-form copy and can change. */
        String code
) {
}
