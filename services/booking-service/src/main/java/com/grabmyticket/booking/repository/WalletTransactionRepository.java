package com.grabmyticket.booking.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.grabmyticket.booking.entity.WalletTransaction;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, UUID> {

    Page<WalletTransaction> findByWalletIdOrderByCreatedAtDesc(UUID walletId, Pageable pageable);
}
