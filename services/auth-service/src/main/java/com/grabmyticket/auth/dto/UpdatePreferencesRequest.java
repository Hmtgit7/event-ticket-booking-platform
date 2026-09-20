package com.grabmyticket.auth.dto;

import jakarta.validation.constraints.Pattern;

/**
 * Partial update - every field is optional (null = "leave this field alone",
 * not "clear it"). All three are nullable by design: null elements are
 * treated as valid by Jakarta Bean Validation's @Pattern, so omitting a
 * field never fails validation. Explicitly resetting a CUSTOMER/ORGANIZER
 * override back to "inherit from GLOBAL" isn't supported by this endpoint
 * yet - deferred until the frontend actually needs it.
 */
public record UpdatePreferencesRequest(
        @Pattern(regexp = "^[a-z]{2}(-[A-Za-z0-9]+)?$", message = "language must be a BCP-47 tag, e.g. 'en' or 'es-419'")
        String language,

        /** IANA zone id, e.g. "Asia/Kolkata" - validated against java.time.ZoneId in the service, not by regex here. */
        String timezone,

        @Pattern(regexp = "^[A-Z]{2}$", message = "country must be an ISO 3166-1 alpha-2 code, e.g. 'IN'")
        String country
) {
}
