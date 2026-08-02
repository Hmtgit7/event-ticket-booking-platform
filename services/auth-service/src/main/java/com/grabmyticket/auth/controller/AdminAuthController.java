package com.grabmyticket.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.auth.dto.AdminBootstrapRequest;
import com.grabmyticket.auth.dto.AuthResponse;
import com.grabmyticket.auth.dto.LoginRequest;
import com.grabmyticket.auth.dto.MessageResponse;
import com.grabmyticket.auth.service.AdminAuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth/admin")
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    public AdminAuthController(AdminAuthService adminAuthService) {
        this.adminAuthService = adminAuthService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(adminAuthService.login(request));
    }

    /**
     * One-time bootstrap for the FIRST admin account. Inert unless ADMIN_BOOTSTRAP_SECRET
     * is set - see .env.example for the operational warning about this endpoint.
     */
    @PostMapping("/bootstrap")
    public ResponseEntity<MessageResponse> bootstrap(@Valid @RequestBody AdminBootstrapRequest request) {
        adminAuthService.bootstrap(request.email(), request.bootstrapSecret());
        return ResponseEntity.ok(new MessageResponse("If the request was valid, that account now has admin access"));
    }
}
