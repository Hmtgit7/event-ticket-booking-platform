package com.grabmyticket.event.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.event.dto.internal.DeletionCheckResponse;
import com.grabmyticket.event.service.InternalOrganizerDeletionService;

/**
 * Server-to-server only - authenticated via InternalApiKeyFilter, called by
 * auth-service's account-deletion flow. Never a user JWT, never exposed to
 * the frontend directly - see InternalTicketTypeController for the same pattern.
 */
@RestController
@RequestMapping("/internal/organizers/{organizerId}/deletion")
@PreAuthorize("hasRole('INTERNAL_SERVICE')")
public class InternalOrganizerDeletionController {

    private final InternalOrganizerDeletionService internalOrganizerDeletionService;

    public InternalOrganizerDeletionController(InternalOrganizerDeletionService internalOrganizerDeletionService) {
        this.internalOrganizerDeletionService = internalOrganizerDeletionService;
    }

    /** Read-only eligibility check - safe to poll repeatedly during an organizer's deletion grace period. */
    @GetMapping("/check")
    public ResponseEntity<DeletionCheckResponse> check(@PathVariable UUID organizerId) {
        return ResponseEntity.ok(internalOrganizerDeletionService.checkDeletionEligibility(organizerId));
    }

    /** Mutating - archives never-published drafts, cancels never-sold published events. Only called once at finalization time, never speculatively. */
    @PostMapping("/cleanup")
    public ResponseEntity<Void> cleanup(@PathVariable UUID organizerId) {
        internalOrganizerDeletionService.cleanupForDeletedOrganizer(organizerId);
        return ResponseEntity.ok().build();
    }
}
