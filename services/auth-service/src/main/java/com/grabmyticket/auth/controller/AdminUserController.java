package com.grabmyticket.auth.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.auth.dto.MessageResponse;
import com.grabmyticket.auth.dto.UpdateUserRoleRequest;
import com.grabmyticket.auth.service.AdminUserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @PatchMapping("/{userId}/roles")
    public ResponseEntity<MessageResponse> updateRole(
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateUserRoleRequest request,
            Authentication authentication
    ) {
        UUID actingAdminId = UUID.fromString(authentication.getName());
        adminUserService.updateUserRole(actingAdminId, userId, request.role(), request.action());
        return ResponseEntity.ok(new MessageResponse("Role updated"));
    }
}
