package com.grabmyticket.booking.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.booking.dto.PageResponse;
import com.grabmyticket.booking.dto.WalletResponse;
import com.grabmyticket.booking.dto.WalletTransactionResponse;
import com.grabmyticket.booking.service.WalletService;

/**
 * Read-only now - every endpoint here requires ROLE_USER and operates only
 * on the caller's own wallet, userId always comes from the JWT. Recharge is
 * no longer a booking-service endpoint: the client calls payment-service's
 * POST /payments/orders to start a recharge, and this service's balance
 * only ever changes via PaymentEventListener once Razorpay actually
 * confirms the payment - never from a direct client call.
 */
@RestController
@RequestMapping("/wallet")
@PreAuthorize("hasRole('USER')")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping
    public ResponseEntity<WalletResponse> getWallet(Authentication authentication) {
        return ResponseEntity.ok(walletService.getWallet(userId(authentication)));
    }

    @GetMapping("/transactions")
    public ResponseEntity<PageResponse<WalletTransactionResponse>> getTransactions(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(walletService.getTransactions(userId(authentication), page, size));
    }

    private UUID userId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
