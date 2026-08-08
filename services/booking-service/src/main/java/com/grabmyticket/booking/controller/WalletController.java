package com.grabmyticket.booking.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.booking.dto.PageResponse;
import com.grabmyticket.booking.dto.RechargeWalletRequest;
import com.grabmyticket.booking.dto.WalletResponse;
import com.grabmyticket.booking.dto.WalletTransactionResponse;
import com.grabmyticket.booking.service.WalletService;

import jakarta.validation.Valid;

/** Every endpoint here requires ROLE_USER and operates only on the caller's own wallet - userId always comes from the JWT, never a path/query param. */
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

    @PostMapping("/recharge")
    public ResponseEntity<WalletResponse> recharge(Authentication authentication, @Valid @RequestBody RechargeWalletRequest request) {
        return ResponseEntity.ok(walletService.recharge(userId(authentication), request));
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
