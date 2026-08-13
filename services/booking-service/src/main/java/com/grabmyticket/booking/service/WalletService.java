package com.grabmyticket.booking.service;

import java.math.BigDecimal;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.booking.dto.PageResponse;
import com.grabmyticket.booking.dto.WalletResponse;
import com.grabmyticket.booking.dto.WalletTransactionResponse;
import com.grabmyticket.booking.entity.TransactionReason;
import com.grabmyticket.booking.entity.TransactionStatus;
import com.grabmyticket.booking.entity.TransactionType;
import com.grabmyticket.booking.entity.Wallet;
import com.grabmyticket.booking.entity.WalletTransaction;
import com.grabmyticket.booking.exception.InsufficientBalanceException;
import com.grabmyticket.booking.repository.WalletRepository;
import com.grabmyticket.booking.repository.WalletTransactionRepository;

/**
 * Owns every wallet balance mutation in the system - nothing else is allowed
 * to touch Wallet.balance directly. debit()/credit() are the extension point
 * for other reasons (BOOKING_PAYMENT/BOOKING_REFUND already use them;
 * creditFromPayment() below is what payment-service's Kafka event now drives
 * for RECHARGE - open for extension, closed for modification).
 */
@Service
@Transactional
public class WalletService {

    private static final Logger log = LoggerFactory.getLogger(WalletService.class);

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;

    public WalletService(WalletRepository walletRepository, WalletTransactionRepository transactionRepository) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
    }

    /**
     * Called only from PaymentEventListener once payment-service has
     * confirmed a Razorpay payment actually captured. paymentTransactionId
     * becomes the WalletTransaction's referenceId and is the idempotency
     * key - a duplicate delivery of the same payment.completed event (Kafka
     * consumer redelivery, Razorpay webhook retry replayed upstream) is a
     * no-op here rather than a double credit.
     */
    public void creditFromPayment(UUID userId, UUID paymentTransactionId, BigDecimal amount) {
        if (transactionRepository.existsByReferenceId(paymentTransactionId)) {
            log.info("Ignoring duplicate payment.completed for paymentTransactionId {} - already credited", paymentTransactionId);
            return;
        }
        Wallet wallet = getOrCreateWallet(userId);
        credit(wallet, amount, TransactionReason.RECHARGE, "Wallet recharge", paymentTransactionId);
    }

    @Transactional(readOnly = true)
    public WalletResponse getWallet(UUID userId) {
        return toResponse(getOrCreateWallet(userId));
    }

    @Transactional(readOnly = true)
    public PageResponse<WalletTransactionResponse> getTransactions(UUID userId, int page, int size) {
        Wallet wallet = getOrCreateWallet(userId);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<WalletTransaction> transactions =
                transactionRepository.findByWalletIdOrderByCreatedAtDesc(wallet.getId(), pageable);
        return PageResponse.of(transactions.map(this::toResponse));
    }

    // ───────────────────────── ledger mutations (used by BookingService too) ─────────────────────────

    /** Adds money to the wallet and records the ledger entry. Never fails on balance. */
    public WalletTransaction credit(Wallet wallet, BigDecimal amount, TransactionReason reason, String description, UUID referenceId) {
        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);
        return recordTransaction(wallet, TransactionType.CREDIT, amount, reason, description, referenceId);
    }

    /** Removes money from the wallet. Throws InsufficientBalanceException (no partial charge) if the balance can't cover it. */
    public WalletTransaction debit(Wallet wallet, BigDecimal amount, TransactionReason reason, String description, UUID referenceId) {
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException(
                    "Wallet balance is too low to complete this booking. Please add funds and try again.");
        }
        wallet.setBalance(wallet.getBalance().subtract(amount));
        walletRepository.save(wallet);
        return recordTransaction(wallet, TransactionType.DEBIT, amount, reason, description, referenceId);
    }

    public Wallet getOrCreateWallet(UUID userId) {
        return walletRepository.findByUserId(userId)
                .orElseGet(() -> walletRepository.save(
                        Wallet.builder().userId(userId).balance(BigDecimal.ZERO).build()));
    }

    // ───────────────────────── helpers ─────────────────────────

    private WalletTransaction recordTransaction(
            Wallet wallet, TransactionType type, BigDecimal amount, TransactionReason reason, String description, UUID referenceId
    ) {
        WalletTransaction transaction = WalletTransaction.builder()
                .wallet(wallet)
                .type(type)
                .amount(amount)
                .balanceAfter(wallet.getBalance())
                .reason(reason)
                .status(TransactionStatus.COMPLETED)
                .description(description)
                .referenceId(referenceId)
                .build();
        return transactionRepository.save(transaction);
    }

    private WalletResponse toResponse(Wallet wallet) {
        return new WalletResponse(wallet.getId(), wallet.getBalance(), wallet.getCurrency(), wallet.getUpdatedAt());
    }

    private WalletTransactionResponse toResponse(WalletTransaction transaction) {
        return new WalletTransactionResponse(
                transaction.getId(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getBalanceAfter(),
                transaction.getReason(),
                transaction.getStatus(),
                transaction.getDescription(),
                transaction.getReferenceId(),
                transaction.getCreatedAt()
        );
    }
}
