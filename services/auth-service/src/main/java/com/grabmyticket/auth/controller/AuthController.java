package com.grabmyticket.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.auth.dto.AuthResponse;
import com.grabmyticket.auth.dto.ChangePasswordRequest;
import com.grabmyticket.auth.dto.ForgotPasswordRequest;
import com.grabmyticket.auth.dto.GoogleAuthRequest;
import com.grabmyticket.auth.dto.LinkPasswordConfirmRequest;
import com.grabmyticket.auth.dto.LoginRequest;
import com.grabmyticket.auth.dto.MessageResponse;
import com.grabmyticket.auth.dto.RefreshTokenRequest;
import com.grabmyticket.auth.dto.ResendVerificationRequest;
import com.grabmyticket.auth.dto.ResetPasswordRequest;
import com.grabmyticket.auth.dto.SignupRequest;
import com.grabmyticket.auth.dto.SignupResponse;
import com.grabmyticket.auth.dto.UpdatePersonaRequest;
import com.grabmyticket.auth.dto.UserProfileResponse;
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
    public ResponseEntity<SignupResponse> signup(@Valid @RequestBody SignupRequest request) {
        SignupResponse result = authService.signup(request);
        HttpStatus status = result.accountCreated() ? HttpStatus.CREATED : HttpStatus.OK;
        return ResponseEntity.status(status).body(result);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/oauth2/google")
    public ResponseEntity<AuthResponse> googleLogin(@Valid @RequestBody GoogleAuthRequest request) {
        return ResponseEntity.ok(authService.loginWithGoogle(request.idToken()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refresh(request.refreshToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request.refreshToken());
        return ResponseEntity.ok(new MessageResponse("Logged out"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> me(Authentication authentication) {
        return ResponseEntity.ok(authService.getCurrentUser(authentication.getName()));
    }

    /** Explicit Organizer <-> Customer switch for a dual-role account - see AuthService.updateActivePersona. */
    @PatchMapping("/me/persona")
    public ResponseEntity<UserProfileResponse> updatePersona(
            Authentication authentication, @Valid @RequestBody UpdatePersonaRequest request
    ) {
        return ResponseEntity.ok(authService.updateActivePersona(authentication.getName(), request.persona()));
    }

    /** Requires a valid access token - anyRequest().authenticated() covers this, not in the permitAll list. */
    @PostMapping("/roles/organizer")
    public ResponseEntity<AuthResponse> becomeOrganizer(Authentication authentication) {
        return ResponseEntity.ok(authService.becomeOrganizer(authentication.getName()));
    }

    /** Declining the "also host events?" prompt - stops it resurfacing on future Google logins. */
    @PostMapping("/role-prompt/dismiss")
    public ResponseEntity<MessageResponse> dismissRolePrompt(Authentication authentication) {
        authService.dismissRolePrompt(authentication.getName());
        return ResponseEntity.ok(new MessageResponse("Preference saved"));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<MessageResponse> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        verificationTokenService.verifyEmail(request.token());
        return ResponseEntity.ok(new MessageResponse("Email verified successfully"));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<MessageResponse> resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        verificationTokenService.resendVerifyEmail(request.email());
        return ResponseEntity.ok(new MessageResponse(
                "If an account with that email exists and isn't verified yet, a new link has been sent"));
    }

    /** Google-only account confirming password link, from the email sent during a colliding /auth/signup. */
    @PostMapping("/link-password/confirm")
    public ResponseEntity<AuthResponse> confirmLinkPassword(@Valid @RequestBody LinkPasswordConfirmRequest request) {
        return ResponseEntity.ok(authService.confirmLinkPassword(request.token(), request.newPassword()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.email());
        return ResponseEntity.ok(new MessageResponse(
                "If an account with that email exists, a password reset link has been sent"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request.token(), request.newPassword()));
    }

    /** Authenticated Settings-page change. currentPassword is optional - see AuthService.changePassword. */
    @PostMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        authService.changePassword(authentication.getName(), request.currentPassword(), request.newPassword());
        return ResponseEntity.ok(new MessageResponse("Password updated"));
    }
}
