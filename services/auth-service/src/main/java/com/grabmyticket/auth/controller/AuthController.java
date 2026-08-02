package com.grabmyticket.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.auth.dto.AuthResponse;
import com.grabmyticket.auth.dto.LoginRequest;
import com.grabmyticket.auth.dto.MessageResponse;
import com.grabmyticket.auth.dto.ResendVerificationRequest;
import com.grabmyticket.auth.dto.SignupRequest;
import com.grabmyticket.auth.dto.VerifyEmailRequest;
import com.grabmyticket.auth.service.AuthService;
import com.grabmyticket.auth.service.VerificationTokenService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final VerificationTokenService verificationTokenService;

    public AuthController(AuthService authService, VerificationTokenService verificationTokenService) {
        this.authService = authService;
        this.verificationTokenService = verificationTokenService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<MessageResponse> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        verificationTokenService.verify(request.token());
        return ResponseEntity.ok(new MessageResponse("Email verified successfully"));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<MessageResponse> resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        verificationTokenService.resend(request.email());
        return ResponseEntity.ok(new MessageResponse(
                "If an account with that email exists and isn't verified yet, a new link has been sent"));
    }
}
