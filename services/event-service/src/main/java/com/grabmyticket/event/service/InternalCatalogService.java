package com.grabmyticket.event.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.event.dto.internal.TicketTypeSnapshotResponse;
import com.grabmyticket.event.entity.TicketType;
import com.grabmyticket.event.exception.InsufficientSeatsException;
import com.grabmyticket.event.exception.TicketTypeNotFoundException;
import com.grabmyticket.event.repository.TicketTypeRepository;

/**
 * Server-to-server contract for booking-service. Deliberately separate from
 * EventService - this is a different caller (a service, not an organizer) with
 * a different authorization model (shared secret, not JWT+ownership), so it
 * gets its own service class rather than new "if internal" branches inside
 * EventService's organizer-facing methods.
 */
@Service
@Transactional
public class InternalCatalogService {

    private final TicketTypeRepository ticketTypeRepository;

    public InternalCatalogService(TicketTypeRepository ticketTypeRepository) {
        this.ticketTypeRepository = ticketTypeRepository;
    }

    @Transactional(readOnly = true)
    public TicketTypeSnapshotResponse getSnapshot(UUID ticketTypeId) {
        TicketType ticketType = ticketTypeRepository.findById(ticketTypeId)
                .orElseThrow(TicketTypeNotFoundException::new);
        return toSnapshot(ticketType);
    }

    public void reserveSeats(UUID ticketTypeId, int quantity) {
        int updated = ticketTypeRepository.reserveSeats(ticketTypeId, quantity);
        if (updated == 0) {
            if (!ticketTypeRepository.existsById(ticketTypeId)) {
                throw new TicketTypeNotFoundException();
            }
            throw new InsufficientSeatsException();
        }
    }

    public void releaseSeats(UUID ticketTypeId, int quantity) {
        int updated = ticketTypeRepository.releaseSeats(ticketTypeId, quantity);
        if (updated == 0) {
            throw new TicketTypeNotFoundException();
        }
    }

    private TicketTypeSnapshotResponse toSnapshot(TicketType ticketType) {
        var event = ticketType.getEvent();
        return new TicketTypeSnapshotResponse(
                ticketType.getId(),
                event.getId(),
                event.getTitle(),
                event.getStartAt(),
                event.getBannerImageUrl(),
                event.getStatus(),
                ticketType.getName(),
                ticketType.getPrice(),
                ticketType.getQuantityAvailable(),
                ticketType.getSalesStart(),
                ticketType.getSalesEnd()
        );
    }
}
