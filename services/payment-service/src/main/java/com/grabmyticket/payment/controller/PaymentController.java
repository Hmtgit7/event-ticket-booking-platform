package com.grabmyticket.payment.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.payment.dto.CreateOrderRequest;
import com.grabmyticket.payment.dto.CreateOrderResponse;
import com.grabmyticket.payment.service.RazorpayService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final RazorpayService razorpayService;

    public PaymentController(RazorpayService razorpayService) {
        this.razorpayService = razorpayService;
    }

    /** Creates a Razorpay order for a wallet recharge. userId always comes from the JWT, never a body/path param - same rule as WalletController. */
    @PostMapping("/orders")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CreateOrderResponse> createOrder(Authentication authentication, @Valid @RequestBody CreateOrderRequest request) {
        UUID userId = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(razorpayService.createOrder(userId, request));
    }

    /**
     * permitAll in SecurityConfig - there is no user JWT on this request at
     * all, Razorpay calls it server-to-server. Trust comes entirely from the
     * X-Razorpay-Signature HMAC check inside RazorpayService.handleWebhook,
     * so @RequestBody must stay a raw String here - Spring's default JSON
     * binding would re-serialize the body and break signature verification.
     */
    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(
            @RequestBody String rawBody,
            @RequestHeader("X-Razorpay-Signature") String signature
    ) {
        razorpayService.handleWebhook(rawBody, signature);
        return ResponseEntity.ok().build();
    }
}
