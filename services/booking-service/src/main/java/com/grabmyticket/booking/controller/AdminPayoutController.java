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

import com.grabmyticket.booking.dto.PageResponse;
import com.grabmyticket.booking.dto.PayoutRequestResponse;
import com.grabmyticket.booking.dto.RejectPayoutRequest;
import com.grabmyticket.booking.service.PayoutService;

/**
 * Backend-only for now - no UI calls this until Phase 7 builds the admin
 * payout-approval screen. Built now (rather than deferred) so that screen
 * is purely a frontend task later: list REQUESTED payouts, approve/reject
 * buttons, done. adminId (the reviewer) always comes from the JWT, same
 * identity rule as everywhere else - never trust a client-supplied admin id.
 */
@RestController
@RequestMapping("/admin/payouts")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPayoutController {

    private final PayoutService payoutService;

    public AdminPayoutController(PayoutService payoutService) {
        this.payoutService = payoutService;
    }

    @GetMapping("/pending")
    public ResponseEntity<PageResponse<PayoutRequestResponse>> getPendingPayoutRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(payoutService.getPendingPayoutRequests(page, size));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<PayoutRequestResponse> approve(Authentication authentication, @PathVariable UUID id) {
        return ResponseEntity.ok(payoutService.approvePayoutRequest(id, adminId(authentication)));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<PayoutRequestResponse> reject(
            Authentication authentication, @PathVariable UUID id, @RequestBody RejectPayoutRequest request
    ) {
        return ResponseEntity.ok(payoutService.rejectPayoutRequest(id, adminId(authentication), request.note()));
    }

    private UUID adminId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
