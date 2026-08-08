package com.grabmyticket.event.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import com.grabmyticket.event.dto.internal.SeatAdjustmentRequest;
import com.grabmyticket.event.dto.internal.TicketTypeSnapshotResponse;
import com.grabmyticket.event.service.InternalCatalogService;

import jakarta.validation.Valid;

/**
 * Server-to-server only - authenticated via InternalApiKeyFilter (shared
 * secret header), never a user JWT. Do not add anything user-facing here;
 * see PublicEventController / EventController for that.
 */
@RestController
@RequestMapping("/internal/ticket-types")
@PreAuthorize("hasRole('INTERNAL_SERVICE')")
public class InternalTicketTypeController {

    private final InternalCatalogService internalCatalogService;

    public InternalTicketTypeController(InternalCatalogService internalCatalogService) {
        this.internalCatalogService = internalCatalogService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketTypeSnapshotResponse> getSnapshot(@PathVariable UUID id) {
        return ResponseEntity.ok(internalCatalogService.getSnapshot(id));
    }

    @PostMapping("/{id}/reserve")
    public ResponseEntity<Void> reserve(@PathVariable UUID id, @Valid @RequestBody SeatAdjustmentRequest request) {
        internalCatalogService.reserveSeats(id, request.quantity());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/release")
    public ResponseEntity<Void> release(@PathVariable UUID id, @Valid @RequestBody SeatAdjustmentRequest request) {
        internalCatalogService.releaseSeats(id, request.quantity());
        return ResponseEntity.ok().build();
    }
}
