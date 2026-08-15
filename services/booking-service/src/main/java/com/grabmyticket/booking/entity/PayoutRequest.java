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
 * An organizer's request to withdraw their earned (post-commission) revenue
 * to their bank account. This is NOT a wallet - organizers have no wallet at
 * all. The actual Razorpay Route transfer happens in payment-service once an
 * admin approves; this row is booking-service's record of the request and
 * its lifecycle, kept separate from WalletTransaction since the two are
 * conceptually different ledgers (customer spend-only credit vs. organizer
 * marketplace settlement).
 */
@Entity
@Table(name = "payout_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class PayoutRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "organizer_id", nullable = false)
    private UUID organizerId;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Builder.Default
    private PayoutStatus status = PayoutStatus.REQUESTED;

    /** Set when an admin approves/rejects - who and why, for the audit trail this phase's admin panel will read. */
    @Column(name = "reviewed_by")
    private UUID reviewedBy;

    @Column(name = "review_note", length = 500)
    private String reviewNote;

    @Column(name = "reviewed_at")
    private Instant reviewedAt;

    /** Set once payment-service confirms the Razorpay Route transfer (Phase 2c) - null until then. */
    @Column(name = "razorpay_payout_id", length = 64)
    private String razorpayPayoutId;

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
