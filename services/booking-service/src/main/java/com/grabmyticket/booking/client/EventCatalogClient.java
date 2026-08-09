package com.grabmyticket.booking.client;

import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import com.grabmyticket.booking.exception.EventServiceUnavailableException;
import com.grabmyticket.booking.exception.SeatsUnavailableException;
import com.grabmyticket.booking.exception.TicketTypeNotFoundException;

/**
 * Only place in booking-service that talks to event-service. Every call
 * carries the shared X-Internal-Api-Key header - there's no user token to
 * forward here, this is service-to-service, not on-behalf-of-user.
 */
@Component
public class EventCatalogClient {

    private static final String INTERNAL_API_KEY_HEADER = "X-Internal-Api-Key";

    private final RestClient restClient;
    private final InternalApiKeyProperties apiKeyProperties;

    public EventCatalogClient(EventServiceProperties eventServiceProperties, InternalApiKeyProperties apiKeyProperties) {
        this.restClient = RestClient.builder().baseUrl(eventServiceProperties.baseUrl()).build();
        this.apiKeyProperties = apiKeyProperties;
    }

    public TicketTypeSnapshot getSnapshot(UUID ticketTypeId) {
        try {
            return restClient.get()
                    .uri("/internal/ticket-types/{id}", ticketTypeId)
                    .header(INTERNAL_API_KEY_HEADER, apiKeyProperties.secret())
                    .retrieve()
                    .body(TicketTypeSnapshot.class);
        } catch (HttpClientErrorException.NotFound ex) {
            throw new TicketTypeNotFoundException();
        } catch (Exception ex) {
            throw new EventServiceUnavailableException("Couldn't reach event-service to check ticket availability. Please try again.");
        }
    }

    public void reserveSeats(UUID ticketTypeId, int quantity) {
        try {
            restClient.post()
                    .uri("/internal/ticket-types/{id}/reserve", ticketTypeId)
                    .header(INTERNAL_API_KEY_HEADER, apiKeyProperties.secret())
                    .body(new SeatAdjustmentBody(quantity))
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpClientErrorException.Conflict ex) {
            throw new SeatsUnavailableException();
        } catch (HttpClientErrorException.NotFound ex) {
            throw new TicketTypeNotFoundException();
        } catch (Exception ex) {
            throw new EventServiceUnavailableException("Couldn't reserve seats with event-service. Please try again.");
        }
    }

    /** Best-effort rollback - if this also fails, seats stay held until an admin reconciliation job catches it later (not built yet). */
    public void releaseSeats(UUID ticketTypeId, int quantity) {
        try {
            restClient.post()
                    .uri("/internal/ticket-types/{id}/release", ticketTypeId)
                    .header(INTERNAL_API_KEY_HEADER, apiKeyProperties.secret())
                    .body(new SeatAdjustmentBody(quantity))
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception ignored) {
            // Deliberately swallowed: releaseSeats is already a failure-path rollback,
            // and the caller has nothing further to roll back to.
        }
    }

    private record SeatAdjustmentBody(int quantity) {
    }
}
