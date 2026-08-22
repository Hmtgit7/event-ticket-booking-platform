package com.grabmyticket.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.auth.dto.AccountDeletionStatusResponse;
import com.grabmyticket.auth.dto.DeletionEligibilityResponse;
import com.grabmyticket.auth.dto.MessageResponse;
import com.grabmyticket.auth.dto.RequestAccountDeletionRequest;
import com.grabmyticket.auth.entity.DeletionScope;
import com.grabmyticket.auth.service.AccountDeletionService;

import jakarta.validation.Valid;

/**
 * Self-service account/profile deletion (Phase 9). Everything here requires
 * a valid access token - covered by anyRequest().authenticated() in
 * SecurityConfig, same as /auth/me and /auth/me/persona, no permitAll
 * entries needed.
 */
@RestController
@RequestMapping("/auth/me")
public class AccountDeletionController {

    private final AccountDeletionService accountDeletionService;

    public AccountDeletionController(AccountDeletionService accountDeletionService) {
        this.accountDeletionService = accountDeletionService;
    }

    /** Pollable during the grace period - shows exactly what's still blocking (or warning about) the chosen scope. */
    @GetMapping("/deletion-eligibility")
    public ResponseEntity<DeletionEligibilityResponse> checkEligibility(Authentication authentication, @RequestParam DeletionScope scope) {
        return ResponseEntity.ok(accountDeletionService.checkEligibility(authentication.getName(), scope));
    }

    @PostMapping("/deletion-request")
    public ResponseEntity<AccountDeletionStatusResponse> requestDeletion(
            Authentication authentication, @Valid @RequestBody RequestAccountDeletionRequest request
    ) {
        return ResponseEntity.ok(accountDeletionService.requestDeletion(
                authentication.getName(), request.scope(), request.currentPassword(), request.acknowledgeWarnings()));
    }

    @DeleteMapping("/deletion-request")
    public ResponseEntity<MessageResponse> cancelDeletion(Authentication authentication) {
        accountDeletionService.cancelDeletion(authentication.getName());
        return ResponseEntity.ok(new MessageResponse("Account deletion request cancelled"));
    }

    @GetMapping("/deletion-request")
    public ResponseEntity<AccountDeletionStatusResponse> getDeletionStatus(Authentication authentication) {
        return ResponseEntity.ok(accountDeletionService.getDeletionStatus(authentication.getName()));
    }
}
