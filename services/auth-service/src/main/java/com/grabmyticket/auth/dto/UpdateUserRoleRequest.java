package com.grabmyticket.auth.dto;

import com.grabmyticket.auth.entity.RoleName;

import jakarta.validation.constraints.NotNull;

public record UpdateUserRoleRequest(
        @NotNull(message = "role is required")
        RoleName role,

        @NotNull(message = "action is required")
        RoleAction action
) {
}
