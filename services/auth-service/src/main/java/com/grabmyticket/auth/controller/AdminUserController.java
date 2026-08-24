package com.grabmyticket.auth.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.auth.dto.AdminUserDetailResponse;
import com.grabmyticket.auth.dto.AdminUserSummaryResponse;
import com.grabmyticket.auth.dto.ForceDeleteAccountRequest;
import com.grabmyticket.auth.dto.MessageResponse;
import com.grabmyticket.auth.dto.PageResponse;
import com.grabmyticket.auth.dto.SuspendUserRequest;
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

    @GetMapping
    public ResponseEntity<PageResponse<AdminUserSummaryResponse>> listUsers(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(adminUserService.listUsers(search, page, size));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<AdminUserDetailResponse> getUser(@PathVariable UUID userId, Authentication authentication) {
        return ResponseEntity.ok(adminUserService.getUser(actingAdminId(authentication), userId));
    }

    @PatchMapping("/{userId}/roles")
    public ResponseEntity<MessageResponse> updateRole(
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateUserRoleRequest request,
            Authentication authentication
    ) {
        adminUserService.updateUserRole(actingAdminId(authentication), userId, request.role(), request.action());
        return ResponseEntity.ok(new MessageResponse("Role updated"));
    }

    @PatchMapping("/{userId}/suspend")
    public ResponseEntity<MessageResponse> suspendUser(
            @PathVariable UUID userId, @Valid @RequestBody SuspendUserRequest request, Authentication authentication
    ) {
        adminUserService.suspendUser(actingAdminId(authentication), userId, request.reason());
        return ResponseEntity.ok(new MessageResponse("User suspended"));
    }

    @PatchMapping("/{userId}/reinstate")
    public ResponseEntity<MessageResponse> reinstateUser(@PathVariable UUID userId, Authentication authentication) {
        adminUserService.reinstateUser(actingAdminId(authentication), userId);
        return ResponseEntity.ok(new MessageResponse("User reinstated"));
    }

    /** Bypasses blockers/warnings/grace-period - see AccountDeletionService.forceDelete's class comment for exactly what this can and can't override. */
    @PostMapping("/{userId}/force-delete")
    public ResponseEntity<MessageResponse> forceDeleteUser(
            @PathVariable UUID userId, @Valid @RequestBody ForceDeleteAccountRequest request, Authentication authentication
    ) {
        adminUserService.forceDeleteUser(actingAdminId(authentication), userId, request.scope(), request.reason());
        return ResponseEntity.ok(new MessageResponse("Account force-deleted"));
    }

    private UUID actingAdminId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
