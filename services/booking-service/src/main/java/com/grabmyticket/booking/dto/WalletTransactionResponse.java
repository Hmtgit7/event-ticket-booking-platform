package com.grabmyticket.booking.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import com.grabmyticket.booking.entity.TransactionReason;
import com.grabmyticket.booking.entity.TransactionStatus;
import com.grabmyticket.booking.entity.TransactionType;

public record WalletTransactionResponse(
        UUID id,
        TransactionType type,
        BigDecimal amount,
        BigDecimal balanceAfter,
        TransactionReason reason,
        TransactionStatus status,
        String description,
        UUID referenceId,
        Instant createdAt
) {
}
