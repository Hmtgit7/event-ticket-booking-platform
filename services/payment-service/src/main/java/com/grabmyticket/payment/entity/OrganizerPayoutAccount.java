package com.grabmyticket.payment.entity;

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
 * One organizer's Razorpay payout destination - a Contact + Fund Account,
 * both created via RazorpayX's REST API (RazorpayXClient). The full bank
 * account number is NEVER persisted here - only the last 4 digits, purely
 * for the organizer to recognize which account is on file. Razorpay is the
 * system of record for the actual account number, per the DPDP
 * data-minimization principle (don't store what you don't need to).
 */
@Entity
@Table(name = "organizer_payout_accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class OrganizerPayoutAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "organizer_id", nullable = false, unique = true)
    private UUID organizerId;

    @Column(name = "account_holder_name", nullable = false, length = 120)
    private String accountHolderName;

    @Column(name = "bank_account_last4", nullable = false, length = 4)
    private String bankAccountLast4;

    @Column(name = "ifsc_code", nullable = false, length = 11)
    private String ifscCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Builder.Default
    private PayoutAccountStatus status = PayoutAccountStatus.PENDING;

    @Column(name = "razorpay_contact_id", length = 64)
    private String razorpayContactId;

    @Column(name = "razorpay_fund_account_id", length = 64)
    private String razorpayFundAccountId;

    @Column(name = "failure_reason", length = 255)
    private String failureReason;

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
