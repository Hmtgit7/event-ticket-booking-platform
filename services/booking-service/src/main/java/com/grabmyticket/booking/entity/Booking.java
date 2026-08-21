package com.grabmyticket.booking.entity;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A confirmed (or attempted) ticket purchase. eventId/ticketTypeId reference
 * event-service's tables with no cross-service FK (same pattern as
 * Event.organizerId). eventTitle/eventStartAt/ticketTypeName/unitPrice are
 * snapshots taken at booking time - the orders list reads them straight off
 * this row instead of joining event-service on every page load, and it means
 * an organizer editing the price/title later never rewrites what a past
 * booking says was charged.
 */
@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** Short human-facing reference, e.g. "GMT-24018" - shown in the orders list, not used for lookups. */
    @Column(name = "booking_code", nullable = false, unique = true, length = 20)
    private String bookingCode;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "event_id", nullable = false)
    private UUID eventId;

    /** Snapshot of the event's organizer at booking time - what Phase 2's organizer revenue/tickets-sold endpoints group by. Nullable only for rows that predate this column (see V2 migration). */
    @Column(name = "organizer_id")
    private UUID organizerId;

    @Column(name = "ticket_type_id", nullable = false)
    private UUID ticketTypeId;

    @Column(name = "event_title", nullable = false, length = 200)
    private String eventTitle;

    @Column(name = "event_start_at", nullable = false)
    private Instant eventStartAt;

    @Column(name = "event_banner_url", length = 500)
    private String eventBannerUrl;

    @Column(name = "ticket_type_name", nullable = false, length = 100)
    private String ticketTypeName;

    /** Snapshot of the event's venue at booking time - same rationale as eventTitle. Nullable only for rows that predate this column (see V7 migration). */
    @Column(name = "venue_name", length = 200)
    private String venueName;

    @Column(length = 300)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(nullable = false)
    private Integer quantity;

    /** Snapshot of TicketType.price at booking time. */
    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "cancelled_at")
    private Instant cancelledAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
