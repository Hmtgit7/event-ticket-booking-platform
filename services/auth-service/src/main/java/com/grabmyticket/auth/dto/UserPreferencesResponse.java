package com.grabmyticket.auth.dto;

import com.grabmyticket.auth.entity.PreferenceScope;

/**
 * Fully resolved preferences for the requested scope - never has null
 * language/timezone, since GLOBAL always falls back to the platform default
 * when unset (see UserPreferenceService). country can still be null - there
 * is no sensible platform-wide default country, only what geolocation/IP
 * resolution or the user themselves has set.
 * <p>
 * The *Inherited flags tell the frontend whether each value is an explicit
 * override at this scope (false) or fell through from GLOBAL / the platform
 * default (true) - e.g. to render "(inherited)" next to a field on the
 * organizer preferences screen.
 */
public record UserPreferencesResponse(
        PreferenceScope scope,
        String language,
        boolean languageInherited,
        String timezone,
        boolean timezoneInherited,
        String country,
        boolean countryInherited
) {
}
