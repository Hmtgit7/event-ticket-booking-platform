package com.grabmyticket.booking.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * PLACEHOLDER endpoints to prove the JWT/RBAC wiring works end-to-end
 * (auth-service's token accepted here, roles enforced correctly). Real Booking
 * domain (entities, seat holds, Razorpay, Kafka events) is separate future
 * work - do not build on top of this controller, replace it.
 */
@RestController
@RequestMapping("/bookings")
public class BookingController {

    @GetMapping("/public/ping")
    public ResponseEntity<Map<String, String>> publicPing() {
        return ResponseEntity.ok(Map.of("status", "ok", "service", "booking-service"));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, String>> createBookingPlaceholder() {
        return ResponseEntity.ok(Map.of(
                "message", "RBAC check passed - you have ROLE_USER. Real booking creation isn't built yet."
        ));
    }
}
