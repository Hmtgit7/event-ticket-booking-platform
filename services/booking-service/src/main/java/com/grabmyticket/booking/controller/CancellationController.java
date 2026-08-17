package com.grabmyticket.booking.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.booking.dto.CancellationRequestResponse;
import com.grabmyticket.booking.dto.CreateCancellationRequest;
import com.grabmyticket.booking.dto.PageResponse;
import com.grabmyticket.booking.service.CancellationService;

import jakarta.validation.Valid;

/** Every endpoint here requires ROLE_USER and scopes to the caller's own bookings/requests - same identity rule as WalletController/BookingController. */
@RestController
@RequestMapping("/bookings")
@PreAuthorize("hasRole('USER')")
public class CancellationController {

    private final CancellationService cancellationService;

    public CancellationController(CancellationService cancellationService) {
        this.cancellationService = cancellationService;
    }

    @PostMapping("/{bookingId}/cancellation-requests")
    public ResponseEntity<CancellationRequestResponse> requestCancellation(
            Authentication authentication, @PathVariable UUID bookingId, @Valid @RequestBody CreateCancellationRequest request
    ) {
        CancellationRequestResponse response = cancellationService.requestCancellation(userId(authentication), bookingId, request.reason());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/cancellation-requests")
    public ResponseEntity<PageResponse<CancellationRequestResponse>> getMyCancellationRequests(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(cancellationService.getMyCancellationRequests(userId(authentication), page, size));
    }

    private UUID userId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
