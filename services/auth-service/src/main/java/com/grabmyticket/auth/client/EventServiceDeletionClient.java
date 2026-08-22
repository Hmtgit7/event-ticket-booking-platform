package com.grabmyticket.auth.client;

import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.grabmyticket.auth.dto.internal.DeletionCheckResponse;
import com.grabmyticket.auth.exception.AccountDeletionServiceUnavailableException;

/** Only place in auth-service that talks to event-service. Same conventions as BookingServiceDeletionClient. */
@Component
public class EventServiceDeletionClient {

    private static final String INTERNAL_API_KEY_HEADER = "X-Internal-Api-Key";

    private final RestClient restClient;
    private final InternalApiKeyProperties apiKeyProperties;

    public EventServiceDeletionClient(EventServiceProperties eventServiceProperties, InternalApiKeyProperties apiKeyProperties) {
        this.restClient = RestClient.builder().baseUrl(eventServiceProperties.baseUrl()).build();
        this.apiKeyProperties = apiKeyProperties;
    }

    public DeletionCheckResponse checkEligibility(UUID organizerId) {
        try {
            return restClient.get()
                    .uri("/internal/organizers/{organizerId}/deletion/check", organizerId)
                    .header(INTERNAL_API_KEY_HEADER, apiKeyProperties.secret())
                    .retrieve()
                    .body(DeletionCheckResponse.class);
        } catch (Exception ex) {
            throw new AccountDeletionServiceUnavailableException(
                    "Couldn't reach event-service to check account deletion eligibility. Please try again.");
        }
    }

    /** Archives never-published drafts, cancels never-sold published events - only called once, at finalization time, never speculatively during the grace period. See event-service's InternalOrganizerDeletionService for the full policy. */
    public void cleanup(UUID organizerId) {
        try {
            restClient.post()
                    .uri("/internal/organizers/{organizerId}/deletion/cleanup", organizerId)
                    .header(INTERNAL_API_KEY_HEADER, apiKeyProperties.secret())
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception ex) {
            throw new AccountDeletionServiceUnavailableException(
                    "Couldn't clean up organizer's events in event-service while finalizing account deletion.");
        }
    }
}
