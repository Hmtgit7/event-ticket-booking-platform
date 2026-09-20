package com.grabmyticket.auth.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.auth.dto.UpdatePreferencesRequest;
import com.grabmyticket.auth.dto.UserPreferencesResponse;
import com.grabmyticket.auth.entity.PreferenceScope;
import com.grabmyticket.auth.service.UserPreferenceService;

import jakarta.validation.Valid;

/**
 * Language/timezone/country preferences (globalization Phase A). Requires a
 * valid access token - covered by anyRequest().authenticated() in
 * SecurityConfig, same as /auth/me. scope defaults to GLOBAL (the
 * account-level default); pass CUSTOMER or ORGANIZER to read/write that
 * persona's override - see PreferenceScope's javadoc.
 */
@RestController
@RequestMapping("/auth/me/preferences")
public class UserPreferenceController {

    private final UserPreferenceService userPreferenceService;

    public UserPreferenceController(UserPreferenceService userPreferenceService) {
        this.userPreferenceService = userPreferenceService;
    }

    @GetMapping
    public ResponseEntity<UserPreferencesResponse> getPreferences(
            Authentication authentication,
            @RequestParam(defaultValue = "GLOBAL") PreferenceScope scope
    ) {
        UUID userId = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(userPreferenceService.resolve(userId, scope));
    }

    @PatchMapping
    public ResponseEntity<UserPreferencesResponse> updatePreferences(
            Authentication authentication,
            @RequestParam(defaultValue = "GLOBAL") PreferenceScope scope,
            @Valid @RequestBody UpdatePreferencesRequest request
    ) {
        UUID userId = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(userPreferenceService.update(userId, scope, request));
    }
}
