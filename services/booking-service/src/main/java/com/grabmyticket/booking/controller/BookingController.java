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

import com.grabmyticket.booking.dto.BookingResponse;
import com.grabmyticket.booking.dto.CreateBookingRequest;
import com.grabmyticket.booking.dto.PageResponse;
import com.grabmyticket.booking.service.BookingService;

import jakarta.validation.Valid;

/** Every endpoint here requires ROLE_USER and operates only on the caller's own bookings - userId always comes from the JWT. */
@RestController
@RequestMapping("/bookings")
@PreAuthorize("hasRole('USER')")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(Authentication authentication, @Valid @RequestBody CreateBookingRequest request) {
        BookingResponse response = bookingService.createBooking(userId(authentication), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/mine")
    public ResponseEntity<PageResponse<BookingResponse>> getMyBookings(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(bookingService.getMyBookings(userId(authentication), page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getMyBooking(Authentication authentication, @PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.getMyBooking(userId(authentication), id));
    }

    private UUID userId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
