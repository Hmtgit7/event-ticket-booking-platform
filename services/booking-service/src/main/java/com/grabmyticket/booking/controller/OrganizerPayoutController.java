package com.grabmyticket.booking.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.booking.dto.AvailableBalanceResponse;
import com.grabmyticket.booking.dto.CreatePayoutRequestRequest;
import com.grabmyticket.booking.dto.PageResponse;
import com.grabmyticket.booking.dto.PayoutRequestResponse;
import com.grabmyticket.booking.service.PayoutService;

import jakarta.validation.Valid;

/** Every endpoint here requires ROLE_ORGANIZER and scopes to the caller's own organizerId - same identity rule as OrganizerBookingController. */
@RestController
@RequestMapping("/bookings/organizer/payouts")
@PreAuthorize("hasRole('ORGANIZER')")
public class OrganizerPayoutController {

    private final PayoutService payoutService;

    public OrganizerPayoutController(PayoutService payoutService) {
        this.payoutService = payoutService;
    }

    @GetMapping("/available-balance")
    public ResponseEntity<AvailableBalanceResponse> getAvailableBalance(Authentication authentication) {
        return ResponseEntity.ok(payoutService.getAvailableBalance(organizerId(authentication)));
    }

    @PostMapping
    public ResponseEntity<PayoutRequestResponse> requestPayout(
            Authentication authentication, @Valid @RequestBody CreatePayoutRequestRequest request
    ) {
        PayoutRequestResponse response = payoutService.requestPayout(organizerId(authentication), request.amount());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<PageResponse<PayoutRequestResponse>> getMyPayoutRequests(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(payoutService.getMyPayoutRequests(organizerId(authentication), page, size));
    }

    private UUID organizerId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
