package com.grabmyticket.auth.client;

import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.grabmyticket.auth.dto.internal.DeletionCheckResponse;
import com.grabmyticket.auth.exception.AccountDeletionServiceUnavailableException;

/**
 * Only place in auth-service that talks to booking-service. Every call
 * carries the shared X-Internal-Api-Key header - service-to-service, not
 * on-behalf-of-user, same convention as booking-service's own EventCatalogClient.
 */
@Component
public class BookingServiceDeletionClient {

    private static final String INTERNAL_API_KEY_HEADER = "X-Internal-Api-Key";

    private final RestClient restClient;
    private final InternalApiKeyProperties apiKeyProperties;

    public BookingServiceDeletionClient(BookingServiceProperties bookingServiceProperties, InternalApiKeyProperties apiKeyProperties) {
        this.restClient = RestClient.builder().baseUrl(bookingServiceProperties.baseUrl()).build();
        this.apiKeyProperties = apiKeyProperties;
    }

    public DeletionCheckResponse checkCustomerEligibility(UUID userId) {
        return check(userId, "CUSTOMER");
    }

    public DeletionCheckResponse checkOrganizerEligibility(UUID organizerId) {
        return check(organizerId, "ORGANIZER");
    }

    private DeletionCheckResponse check(UUID userId, String scope) {
        try {
            return restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/internal/users/{userId}/deletion/check")
                            .queryParam("scope", scope)
                            .build(userId))
                    .header(INTERNAL_API_KEY_HEADER, apiKeyProperties.secret())
                    .retrieve()
                    .body(DeletionCheckResponse.class);
        } catch (Exception ex) {
            throw new AccountDeletionServiceUnavailableException(
                    "Couldn't reach booking-service to check account deletion eligibility. Please try again.");
        }
    }
}
