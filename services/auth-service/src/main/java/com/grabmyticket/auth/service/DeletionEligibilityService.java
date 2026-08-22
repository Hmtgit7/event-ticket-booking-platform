package com.grabmyticket.auth.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.grabmyticket.auth.client.BookingServiceDeletionClient;
import com.grabmyticket.auth.client.EventServiceDeletionClient;
import com.grabmyticket.auth.dto.DeletionBlocker;
import com.grabmyticket.auth.dto.DeletionEligibilityResponse;
import com.grabmyticket.auth.dto.internal.DeletionCheckResponse;
import com.grabmyticket.auth.entity.DeletionScope;
import com.grabmyticket.auth.entity.RoleName;
import com.grabmyticket.auth.entity.User;

/**
 * Orchestrates the "is this profile clear to delete" question by calling out
 * to booking-service (always) and event-service (organizer scope only) -
 * the two services that own everything that can be "pending" for an account,
 * per the Phase 9 plan's blocker table. auth-service itself owns none of
 * that data, so this class never queries anything locally beyond the user's
 * own roles to decide which calls are even relevant.
 *
 * Used both by the live GET /auth/me/deletion-eligibility endpoint (called
 * repeatedly while a request is pending, so the frontend can show current
 * blockers) and by AccountDeletionReaper's one-last-check before it actually
 * finalizes a deletion once the grace period elapses.
 */
@Service
public class DeletionEligibilityService {

    private final BookingServiceDeletionClient bookingServiceDeletionClient;
    private final EventServiceDeletionClient eventServiceDeletionClient;

    public DeletionEligibilityService(
            BookingServiceDeletionClient bookingServiceDeletionClient,
            EventServiceDeletionClient eventServiceDeletionClient
    ) {
        this.bookingServiceDeletionClient = bookingServiceDeletionClient;
        this.eventServiceDeletionClient = eventServiceDeletionClient;
    }

    public DeletionEligibilityResponse check(User user, DeletionScope scope) {
        boolean checkCustomer = (scope == DeletionScope.CUSTOMER || scope == DeletionScope.FULL_ACCOUNT) && user.hasRole(RoleName.ROLE_USER);
        boolean checkOrganizer = (scope == DeletionScope.ORGANIZER || scope == DeletionScope.FULL_ACCOUNT) && user.hasRole(RoleName.ROLE_ORGANIZER);

        List<DeletionBlocker> blockers = new ArrayList<>();
        List<DeletionBlocker> warnings = new ArrayList<>();

        if (checkCustomer) {
            DeletionCheckResponse result = bookingServiceDeletionClient.checkCustomerEligibility(user.getId());
            blockers.addAll(result.blockers());
            warnings.addAll(result.warnings());
        }

        if (checkOrganizer) {
            DeletionCheckResponse bookingResult = bookingServiceDeletionClient.checkOrganizerEligibility(user.getId());
            blockers.addAll(bookingResult.blockers());
            warnings.addAll(bookingResult.warnings());

            DeletionCheckResponse eventResult = eventServiceDeletionClient.checkEligibility(user.getId());
            blockers.addAll(eventResult.blockers());
            warnings.addAll(eventResult.warnings());
        }

        return DeletionEligibilityResponse.of(scope, blockers, warnings);
    }
}
