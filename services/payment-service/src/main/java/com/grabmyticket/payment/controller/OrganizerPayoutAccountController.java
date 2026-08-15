package com.grabmyticket.payment.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.payment.dto.PayoutAccountResponse;
import com.grabmyticket.payment.dto.SubmitPayoutAccountRequest;
import com.grabmyticket.payment.service.PayoutAccountService;

import jakarta.validation.Valid;

/** Every endpoint here requires ROLE_ORGANIZER and scopes to the caller's own organizerId - same JWT-subject-as-identity rule as every other organizer endpoint in this system. */
@RestController
@RequestMapping("/organizer/payout-account")
@PreAuthorize("hasRole('ORGANIZER')")
public class OrganizerPayoutAccountController {

    private final PayoutAccountService payoutAccountService;

    public OrganizerPayoutAccountController(PayoutAccountService payoutAccountService) {
        this.payoutAccountService = payoutAccountService;
    }

    @PostMapping
    public ResponseEntity<PayoutAccountResponse> submit(Authentication authentication, @Valid @RequestBody SubmitPayoutAccountRequest request) {
        return ResponseEntity.ok(payoutAccountService.submit(organizerId(authentication), request));
    }

    @GetMapping
    public ResponseEntity<PayoutAccountResponse> getMyPayoutAccount(Authentication authentication) {
        return ResponseEntity.ok(payoutAccountService.getMyPayoutAccount(organizerId(authentication)));
    }

    private UUID organizerId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
