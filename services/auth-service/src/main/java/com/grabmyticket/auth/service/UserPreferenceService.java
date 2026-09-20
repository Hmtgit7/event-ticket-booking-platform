package com.grabmyticket.auth.service;

import java.time.DateTimeException;
import java.time.ZoneId;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.auth.dto.UpdatePreferencesRequest;
import com.grabmyticket.auth.dto.UserPreferencesResponse;
import com.grabmyticket.auth.entity.PreferenceScope;
import com.grabmyticket.auth.entity.UserPreference;
import com.grabmyticket.auth.exception.InvalidTimezoneException;
import com.grabmyticket.auth.repository.UserPreferenceRepository;

/**
 * Three-tier preference resolution: a hardcoded platform default, overridden
 * by the account's GLOBAL row (if one exists), overridden again by a
 * CUSTOMER/ORGANIZER persona-scoped row (if one exists) when that scope is
 * requested. See PreferenceScope's javadoc for the full picture.
 * <p>
 * Reads never write - a GET for a user with no rows at all simply returns
 * the platform defaults with everything marked inherited, no row is created.
 * A row only comes into existence the first time that scope is written to.
 */
@Service
public class UserPreferenceService {

    /** No platform-default country - there is no sensible global default, only what geolocation/IP resolution or the user sets. */
    private static final String PLATFORM_DEFAULT_LANGUAGE = "en";
    private static final String PLATFORM_DEFAULT_TIMEZONE = "UTC";

    private final UserPreferenceRepository userPreferenceRepository;

    public UserPreferenceService(UserPreferenceRepository userPreferenceRepository) {
        this.userPreferenceRepository = userPreferenceRepository;
    }

    @Transactional(readOnly = true)
    public UserPreferencesResponse resolve(UUID userId, PreferenceScope scope) {
        Optional<UserPreference> globalRow = userPreferenceRepository.findByUserIdAndScope(userId, PreferenceScope.GLOBAL);

        String globalLanguage = globalRow.map(UserPreference::getLanguage).orElse(null);
        String globalTimezone = globalRow.map(UserPreference::getTimezone).orElse(null);
        String globalCountry = globalRow.map(UserPreference::getCountry).orElse(null);

        String resolvedLanguage = globalLanguage != null ? globalLanguage : PLATFORM_DEFAULT_LANGUAGE;
        String resolvedTimezone = globalTimezone != null ? globalTimezone : PLATFORM_DEFAULT_TIMEZONE;
        String resolvedCountry = globalCountry; // no platform default to fall back to

        if (scope == PreferenceScope.GLOBAL) {
            return new UserPreferencesResponse(
                    PreferenceScope.GLOBAL,
                    resolvedLanguage, globalLanguage == null,
                    resolvedTimezone, globalTimezone == null,
                    resolvedCountry, globalCountry == null
            );
        }

        Optional<UserPreference> personaRow = userPreferenceRepository.findByUserIdAndScope(userId, scope);
        String personaLanguage = personaRow.map(UserPreference::getLanguage).orElse(null);
        String personaTimezone = personaRow.map(UserPreference::getTimezone).orElse(null);
        String personaCountry = personaRow.map(UserPreference::getCountry).orElse(null);

        return new UserPreferencesResponse(
                scope,
                personaLanguage != null ? personaLanguage : resolvedLanguage, personaLanguage == null,
                personaTimezone != null ? personaTimezone : resolvedTimezone, personaTimezone == null,
                personaCountry != null ? personaCountry : resolvedCountry, personaCountry == null
        );
    }

    /** Upserts the row for exactly the given scope - never touches other scopes' rows. Null fields in the request leave the existing stored value untouched (partial update). */
    @Transactional
    public UserPreferencesResponse update(UUID userId, PreferenceScope scope, UpdatePreferencesRequest request) {
        if (request.timezone() != null) {
            validateTimezone(request.timezone());
        }

        UserPreference row = userPreferenceRepository.findByUserIdAndScope(userId, scope)
                .orElseGet(() -> UserPreference.builder().userId(userId).scope(scope).build());

        if (request.language() != null) {
            row.setLanguage(request.language());
        }
        if (request.timezone() != null) {
            row.setTimezone(request.timezone());
        }
        if (request.country() != null) {
            row.setCountry(request.country());
        }

        userPreferenceRepository.save(row);
        return resolve(userId, scope);
    }

    private void validateTimezone(String timezone) {
        try {
            ZoneId.of(timezone);
        } catch (DateTimeException ex) {
            throw new InvalidTimezoneException("'" + timezone + "' is not a valid IANA timezone id");
        }
    }
}
