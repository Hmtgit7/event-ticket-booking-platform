package com.grabmyticket.event.service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.event.dto.CreateEventRequest;
import com.grabmyticket.event.dto.EventResponse;
import com.grabmyticket.event.dto.EventSummaryResponse;
import com.grabmyticket.event.dto.PageResponse;
import com.grabmyticket.event.dto.TicketTypeRequest;
import com.grabmyticket.event.dto.TicketTypeResponse;
import com.grabmyticket.event.dto.UpdateEventRequest;
import com.grabmyticket.event.entity.Event;
import com.grabmyticket.event.entity.EventStatus;
import com.grabmyticket.event.entity.TicketType;
import com.grabmyticket.event.exception.EventNotFoundException;
import com.grabmyticket.event.exception.InvalidEventStateException;
import com.grabmyticket.event.exception.TicketTypeNotFoundException;
import com.grabmyticket.event.repository.EventRepository;
import com.grabmyticket.event.repository.EventSpecifications;
import com.grabmyticket.event.repository.TicketTypeRepository;

@Service
@Transactional
public class EventService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String SLUG_SUFFIX_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

    private final EventRepository eventRepository;
    private final TicketTypeRepository ticketTypeRepository;

    public EventService(EventRepository eventRepository, TicketTypeRepository ticketTypeRepository) {
        this.eventRepository = eventRepository;
        this.ticketTypeRepository = ticketTypeRepository;
    }

    // ───────────────────────── organizer: create / update ─────────────────────────

    public EventResponse createEvent(UUID organizerId, CreateEventRequest request) {
        if (request.endAt().isBefore(request.startAt()) || request.endAt().equals(request.startAt())) {
            throw new InvalidEventStateException("endAt must be after startAt");
        }

        Event event = Event.builder()
                .organizerId(organizerId)
                .title(request.title())
                .slug(generateUniqueSlug(request.title()))
                .category(request.category())
                .description(request.description())
                .venueName(request.venueName())
                .address(request.address())
                .city(request.city())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .startAt(request.startAt())
                .endAt(request.endAt())
                .bannerImageUrl(request.bannerImageUrl())
                .bannerPublicId(request.bannerPublicId())
                .status(EventStatus.DRAFT)
                .build();

        for (TicketTypeRequest tt : request.ticketTypes()) {
            event.addTicketType(toEntity(tt));
        }

        if (request.publishImmediately()) {
            event.setStatus(EventStatus.PUBLISHED);
            event.setPublishedAt(Instant.now());
        }

        Event saved = eventRepository.save(event);
        return toResponse(saved);
    }

    public EventResponse updateEvent(UUID organizerId, UUID eventId, UpdateEventRequest request) {
        Event event = getOwnedEvent(organizerId, eventId);

        if (event.getStatus() == EventStatus.CANCELLED) {
            throw new InvalidEventStateException("A cancelled event cannot be edited");
        }
        if (request.endAt().isBefore(request.startAt()) || request.endAt().equals(request.startAt())) {
            throw new InvalidEventStateException("endAt must be after startAt");
        }

        event.setTitle(request.title());
        event.setCategory(request.category());
        event.setDescription(request.description());
        event.setVenueName(request.venueName());
        event.setAddress(request.address());
        event.setCity(request.city());
        event.setLatitude(request.latitude());
        event.setLongitude(request.longitude());
        event.setStartAt(request.startAt());
        event.setEndAt(request.endAt());
        if (request.bannerImageUrl() != null) {
            event.setBannerImageUrl(request.bannerImageUrl());
            event.setBannerPublicId(request.bannerPublicId());
        }

        return toResponse(eventRepository.save(event));
    }

    // ───────────────────────── organizer: ticket tiers ─────────────────────────

    public TicketTypeResponse addTicketType(UUID organizerId, UUID eventId, TicketTypeRequest request) {
        Event event = getOwnedEvent(organizerId, eventId);
        if (event.getStatus() == EventStatus.CANCELLED) {
            throw new InvalidEventStateException("A cancelled event cannot be edited");
        }

        TicketType ticketType = toEntity(request);
        event.addTicketType(ticketType);
        eventRepository.save(event);

        return toResponse(ticketType);
    }

    public TicketTypeResponse updateTicketType(UUID organizerId, UUID eventId, UUID ticketTypeId, TicketTypeRequest request) {
        Event event = getOwnedEvent(organizerId, eventId);
        TicketType ticketType = ticketTypeRepository.findByIdAndEventId(ticketTypeId, event.getId())
                .orElseThrow(TicketTypeNotFoundException::new);

        int sold = ticketType.getQuantityTotal() - ticketType.getQuantityAvailable();
        if (request.quantityTotal() < sold) {
            throw new InvalidEventStateException(
                    "quantityTotal cannot be less than tickets already sold (" + sold + ")");
        }

        ticketType.setName(request.name());
        ticketType.setPrice(request.price());
        ticketType.setQuantityAvailable(request.quantityTotal() - sold);
        ticketType.setQuantityTotal(request.quantityTotal());
        ticketType.setSalesStart(request.salesStart());
        ticketType.setSalesEnd(request.salesEnd());

        return toResponse(ticketTypeRepository.save(ticketType));
    }

    public void deleteTicketType(UUID organizerId, UUID eventId, UUID ticketTypeId) {
        Event event = getOwnedEvent(organizerId, eventId);
        TicketType ticketType = ticketTypeRepository.findByIdAndEventId(ticketTypeId, event.getId())
                .orElseThrow(TicketTypeNotFoundException::new);

        if (event.getTicketTypes().size() <= 1 && event.getStatus() == EventStatus.PUBLISHED) {
            throw new InvalidEventStateException("A published event must keep at least one ticket type");
        }
        if (!ticketType.getQuantityAvailable().equals(ticketType.getQuantityTotal())) {
            throw new InvalidEventStateException("Cannot remove a ticket type that already has sales");
        }

        event.getTicketTypes().remove(ticketType);
        eventRepository.save(event);
    }

    // ───────────────────────── organizer: lifecycle ─────────────────────────

    public EventResponse publishEvent(UUID organizerId, UUID eventId) {
        Event event = getOwnedEvent(organizerId, eventId);

        if (event.getStatus() == EventStatus.PUBLISHED) {
            return toResponse(event);
        }
        if (event.getStatus() == EventStatus.CANCELLED) {
            throw new InvalidEventStateException("A cancelled event cannot be published");
        }
        if (event.getTicketTypes().isEmpty()) {
            throw new InvalidEventStateException("Add at least one ticket type before publishing");
        }
        if (!event.getStartAt().isAfter(Instant.now())) {
            throw new InvalidEventStateException("Event start date must be in the future to publish");
        }

        event.setStatus(EventStatus.PUBLISHED);
        event.setPublishedAt(Instant.now());
        return toResponse(eventRepository.save(event));
    }

    public EventResponse cancelEvent(UUID organizerId, UUID eventId) {
        Event event = getOwnedEvent(organizerId, eventId);
        if (event.getStatus() == EventStatus.CANCELLED) {
            return toResponse(event);
        }
        event.setStatus(EventStatus.CANCELLED);
        return toResponse(eventRepository.save(event));
    }

    // ───────────────────────── organizer: reads ─────────────────────────

    @Transactional(readOnly = true)
    public EventResponse getMyEvent(UUID organizerId, UUID eventId) {
        return toResponse(getOwnedEvent(organizerId, eventId));
    }

    @Transactional(readOnly = true)
    public PageResponse<EventSummaryResponse> listMyEvents(UUID organizerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Event> events = eventRepository.findByOrganizerId(organizerId, pageable);
        return PageResponse.of(events.map(this::toSummary));
    }

    // ───────────────────────── public: reads ─────────────────────────

    @Transactional(readOnly = true)
    public PageResponse<EventSummaryResponse> listPublicEvents(
            String category, String city, String search, Instant fromDate, Instant toDate, int page, int size
    ) {
        Specification<Event> spec = EventSpecifications.combine(
                EventSpecifications.hasStatus(EventStatus.PUBLISHED),
                EventSpecifications.hasCategory(category),
                EventSpecifications.hasCity(city),
                EventSpecifications.titleOrDescriptionContains(search),
                EventSpecifications.startsAfter(fromDate),
                EventSpecifications.startsBefore(toDate)
        );
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "startAt"));
        Page<Event> events = eventRepository.findAll(spec, pageable);
        return PageResponse.of(events.map(this::toSummary));
    }

    @Transactional(readOnly = true)
    public EventResponse getPublicEventBySlug(String slug) {
        Event event = eventRepository.findBySlug(slug)
                .filter(e -> e.getStatus() == EventStatus.PUBLISHED)
                .orElseThrow(EventNotFoundException::new);
        return toResponse(event);
    }

    // ───────────────────────── helpers ─────────────────────────

    private Event getOwnedEvent(UUID organizerId, UUID eventId) {
        return eventRepository.findByIdAndOrganizerId(eventId, organizerId)
                .orElseThrow(EventNotFoundException::new);
    }

    private TicketType toEntity(TicketTypeRequest request) {
        return TicketType.builder()
                .name(request.name())
                .price(request.price())
                .quantityTotal(request.quantityTotal())
                .quantityAvailable(request.quantityTotal())
                .salesStart(request.salesStart())
                .salesEnd(request.salesEnd())
                .build();
    }

    private String generateUniqueSlug(String title) {
        String base = title.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("[\\s-]+", "-");
        if (base.isBlank()) {
            base = "event";
        }
        if (base.length() > 180) {
            base = base.substring(0, 180);
        }

        String candidate = base;
        while (eventRepository.existsBySlug(candidate)) {
            candidate = base + "-" + randomSuffix();
        }
        return candidate;
    }

    private String randomSuffix() {
        StringBuilder sb = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            sb.append(SLUG_SUFFIX_CHARS.charAt(RANDOM.nextInt(SLUG_SUFFIX_CHARS.length())));
        }
        return sb.toString();
    }

    private EventResponse toResponse(Event event) {
        List<TicketTypeResponse> tickets = event.getTicketTypes().stream()
                .map(this::toResponse)
                .toList();
        return new EventResponse(
                event.getId(),
                event.getOrganizerId(),
                event.getTitle(),
                event.getSlug(),
                event.getCategory(),
                event.getDescription(),
                event.getVenueName(),
                event.getAddress(),
                event.getCity(),
                event.getLatitude(),
                event.getLongitude(),
                event.getStartAt(),
                event.getEndAt(),
                event.getBannerImageUrl(),
                event.getBannerPublicId(),
                event.getStatus(),
                event.getPublishedAt(),
                tickets,
                event.getCreatedAt(),
                event.getUpdatedAt()
        );
    }

    private TicketTypeResponse toResponse(TicketType ticketType) {
        return new TicketTypeResponse(
                ticketType.getId(),
                ticketType.getName(),
                ticketType.getPrice(),
                ticketType.getQuantityTotal(),
                ticketType.getQuantityAvailable(),
                ticketType.getSalesStart(),
                ticketType.getSalesEnd()
        );
    }

    private EventSummaryResponse toSummary(Event event) {
        var fromPrice = event.getTicketTypes().stream()
                .map(TicketType::getPrice)
                .min(java.util.Comparator.naturalOrder())
                .orElse(null);
        return new EventSummaryResponse(
                event.getId(),
                event.getTitle(),
                event.getSlug(),
                event.getCategory(),
                event.getVenueName(),
                event.getCity(),
                event.getStartAt(),
                event.getEndAt(),
                event.getBannerImageUrl(),
                event.getStatus(),
                fromPrice
        );
    }
}
