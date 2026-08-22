package com.grabmyticket.booking.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.booking.dto.internal.DeletionCheckResponse;
import com.grabmyticket.booking.exception.InvalidDeletionScopeException;
import com.grabmyticket.booking.service.InternalUserDeletionService;

/**
 * Server-to-server only - authenticated via InternalApiKeyFilter, called by
 * auth-service's account-deletion flow. Never a user JWT, never exposed to
 * the frontend directly - see event-service's InternalOrganizerDeletionController
 * for the identical pattern on that side.
 */
@RestController
@RequestMapping("/internal/users/{userId}/deletion")
@PreAuthorize("hasRole('INTERNAL_SERVICE')")
public class InternalUserDeletionController {

    private final InternalUserDeletionService internalUserDeletionService;

    public InternalUserDeletionController(InternalUserDeletionService internalUserDeletionService) {
        this.internalUserDeletionService = internalUserDeletionService;
    }

    /**
     * scope=CUSTOMER checks bookings/cancellations/wallet/support-tickets for this
     * userId as a ticket-buyer. scope=ORGANIZER checks the same userId as an
     * event organizer (payouts, organizer-context support tickets). auth-service
     * calls one or both depending on which roles the account holds.
     */
    @GetMapping("/check")
    public ResponseEntity<DeletionCheckResponse> check(@PathVariable UUID userId, @RequestParam String scope) {
        return switch (scope) {
            case "CUSTOMER" -> ResponseEntity.ok(internalUserDeletionService.checkCustomerDeletionEligibility(userId));
            case "ORGANIZER" -> ResponseEntity.ok(internalUserDeletionService.checkOrganizerDeletionEligibility(userId));
            default -> throw new InvalidDeletionScopeException("scope must be CUSTOMER or ORGANIZER");
        };
    }
}
