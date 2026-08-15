package com.grabmyticket.payment.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.grabmyticket.payment.entity.PayoutTransaction;

public interface PayoutTransactionRepository extends JpaRepository<PayoutTransaction, UUID> {

    boolean existsByPayoutRequestId(UUID payoutRequestId);

    Optional<PayoutTransaction> findByPayoutRequestId(UUID payoutRequestId);
}
