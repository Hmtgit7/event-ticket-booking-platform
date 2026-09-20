package com.grabmyticket.auth.entity;

/**
 * GLOBAL is the account-level default - always exists (created lazily with
 * platform defaults on first read/write, see UserPreferenceService). CUSTOMER
 * and ORGANIZER are optional per-persona overrides for a dual-role account -
 * a row only exists here if that persona explicitly set something different
 * from GLOBAL. Resolution is GLOBAL, overridden field-by-field by the
 * persona-scoped row when one exists - see UserPreferenceService.resolve.
 */
public enum PreferenceScope {
    GLOBAL,
    CUSTOMER,
    ORGANIZER
}
