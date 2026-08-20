package com.grabmyticket.booking.entity;

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
 * A customer or organizer's support issue - lightweight lifecycle tracking
 * (status/priority/resolution note), not a threaded chat/messaging system.
 * userId is whoever submitted it, regardless of persona (customer or
 * organizer) - both are just "users" here, same as everywhere else in this
 * schema. relatedEntityType/relatedEntityId are optional context (e.g. "this
 * ticket is about booking X") for the admin to jump straight to the
 * relevant record.
 */
@Entity
@Table(name = "support_tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class SupportTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 200)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SupportTicketCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    @Builder.Default
    private SupportTicketStatus status = SupportTicketStatus.OPEN;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Builder.Default
    private SupportTicketPriority priority = SupportTicketPriority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(name = "related_entity_type", length = 25)
    private RelatedEntityType relatedEntityType;

    @Column(name = "related_entity_id")
    private UUID relatedEntityId;

    /** Admin's internal note on how this was handled - shown to the submitter alongside the resolved status, same transparency principle as cancellation/payout review notes. */
    @Column(name = "resolution_note", length = 1000)
    private String resolutionNote;

    @Column(name = "assigned_admin_id")
    private UUID assignedAdminId;

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
