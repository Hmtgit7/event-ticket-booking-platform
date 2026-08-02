package com.grabmyticket.auth.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import com.grabmyticket.auth.exception.InvalidGoogleTokenException;

/**
 * Verifies a Google-issued ID token: signature (against Google's published JWKS,
 * fetched via OIDC discovery at https://accounts.google.com), issuer, expiry, and
 * that it was issued FOR OUR app (audience = our GOOGLE_CLIENT_ID - without this
 * check, an ID token issued to any other app using Google Sign-In would be accepted).
 *
 * This is a standalone verifier, not part of Spring Security's filter chain -
 * our own JwtAuthenticationFilter/JwtService remain the only thing that authenticates
 * requests. This class is only ever called manually from AuthService.loginWithGoogle().
 */
@Component
public class GoogleIdTokenVerifier {

    private static final String GOOGLE_ISSUER = "https://accounts.google.com";

    private final NimbusJwtDecoder jwtDecoder;

    public GoogleIdTokenVerifier(@Value("${app.google.client-id:}") String googleClientId) {
        this.jwtDecoder = NimbusJwtDecoder.withIssuerLocation(GOOGLE_ISSUER).build();

        OAuth2TokenValidator<Jwt> defaultValidators = JwtValidators.createDefaultWithIssuer(GOOGLE_ISSUER);
        OAuth2TokenValidator<Jwt> audienceValidator = jwt -> {
            List<String> audiences = jwt.getAudience();
            if (!googleClientId.isBlank() && audiences != null && audiences.contains(googleClientId)) {
                return OAuth2TokenValidatorResult.success();
            }
            return OAuth2TokenValidatorResult.failure(
                    new OAuth2Error("invalid_token", "ID token was not issued for this application", null));
        };

        this.jwtDecoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(defaultValidators, audienceValidator));
    }

    /** Returns the verified claims, or throws InvalidGoogleTokenException if anything doesn't check out. */
    public Jwt verify(String rawIdToken) {
        try {
            return jwtDecoder.decode(rawIdToken);
        } catch (JwtException ex) {
            throw new InvalidGoogleTokenException();
        }
    }
}
