package com.grabmyticket.booking.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.booking.dto.CancellationRequestResponse;
import com.grabmyticket.booking.dto.PageResponse;
import com.grabmyticket.booking.dto.RejectCancellationRequest;
import com.grabmyticket.booking.service.CancellationService;

/** Backend-ready for Phase 7's admin UI, same as AdminPayoutController - adminId always comes from the JWT. */
@RestController
@RequestMapping("/admin/cancellations")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCancellationController {

    private final CancellationService cancellationService;

    public AdminCancellationController(CancellationService cancellationService) {
        this.cancellationService = cancellationService;
    }

    @GetMapping("/pending")
    public ResponseEntity<PageResponse<CancellationRequestResponse>> getPendingCancellationRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(cancellationService.getPendingCancellationRequests(page, size));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<CancellationRequestResponse> approve(Authentication authentication, @PathVariable UUID id) {
        return ResponseEntity.ok(cancellationService.approveCancellation(adminId(authentication), id));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<CancellationRequestResponse> reject(
            Authentication authentication, @PathVariable UUID id, @RequestBody RejectCancellationRequest request
    ) {
        return ResponseEntity.ok(cancellationService.rejectCancellation(adminId(authentication), id, request.note()));
    }

    private UUID adminId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
