package com.grabmyticket.auth.dto;

import jakarta.validation.constraints.NotBlank;

/** persona must be exactly "organizer" or "user" - validated in AuthService.updateActivePersona. */
public record UpdatePersonaRequest(
        @NotBlank String persona
) {
}
