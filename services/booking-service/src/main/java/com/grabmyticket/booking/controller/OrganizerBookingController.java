package com.grabmyticket.booking.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.booking.dto.BookingResponse;
import com.grabmyticket.booking.dto.OrganizerRevenueResponse;
import com.grabmyticket.booking.dto.OrganizerTicketsSoldResponse;
import com.grabmyticket.booking.dto.PageResponse;
import com.grabmyticket.booking.service.BookingService;

/**
 * Every endpoint here requires ROLE_ORGANIZER and scopes to the caller's own
 * organizerId - same JWT-subject-as-identity rule as BookingController, just
 * for the organizer persona. Kept as a separate controller (not endpoints
 * bolted onto BookingController) since the two have different
 * @PreAuthorize roles and different identity semantics (userId vs
 * organizerId), even though organizerId happens to equal the same account's
 * userId under the current dual-role persona model.
 *
 * Endpoints are deliberately single-metric (revenue, tickets-sold, list) per
 * the platform's granular-analytics rule - a future AI service or dashboard
 * widget calls only what it needs instead of paying for a consolidated
 * response every time.
 */
@RestController
@RequestMapping("/bookings/organizer")
@PreAuthorize("hasRole('ORGANIZER')")
public class OrganizerBookingController {

    private final BookingService bookingService;

    public OrganizerBookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/revenue")
    public ResponseEntity<OrganizerRevenueResponse> getRevenue(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getOrganizerRevenue(organizerId(authentication)));
    }

    @GetMapping("/tickets-sold")
    public ResponseEntity<OrganizerTicketsSoldResponse> getTicketsSold(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getOrganizerTicketsSold(organizerId(authentication)));
    }

    @GetMapping("/mine")
    public ResponseEntity<PageResponse<BookingResponse>> getMyEventBookings(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(bookingService.getOrganizerBookings(organizerId(authentication), page, size));
    }

    private UUID organizerId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
