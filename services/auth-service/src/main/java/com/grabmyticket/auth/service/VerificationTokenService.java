package com.grabmyticket.auth.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.auth.entity.TokenPurpose;
import com.grabmyticket.auth.entity.User;
import com.grabmyticket.auth.entity.VerificationToken;
import com.grabmyticket.auth.exception.InvalidOrExpiredTokenException;
import com.grabmyticket.auth.exception.TooManyRequestsException;
import com.grabmyticket.auth.notification.VerificationEmailSender;
import com.grabmyticket.auth.repository.UserRepository;
import com.grabmyticket.auth.repository.VerificationTokenRepository;
import com.grabmyticket.auth.security.TokenGenerator;
import com.grabmyticket.auth.security.VerificationProperties;

@Service
public class VerificationTokenService {

    private final VerificationTokenRepository verificationTokenRepository;
    private final UserRepository userRepository;
    private final TokenGenerator tokenGenerator;
    private final VerificationEmailSender emailSender;
    private final VerificationProperties properties;

    public VerificationTokenService(
            VerificationTokenRepository verificationTokenRepository,
            UserRepository userRepository,
            TokenGenerator tokenGenerator,
            VerificationEmailSender emailSender,
            VerificationProperties properties
    ) {
        this.verificationTokenRepository = verificationTokenRepository;
        this.userRepository = userRepository;
        this.tokenGenerator = tokenGenerator;
        this.emailSender = emailSender;
        this.properties = properties;
    }

    /** Called right after local signup. */
    @Transactional
    public void issueAndSendVerifyEmail(User user) {
        issue(user, TokenPurpose.VERIFY_EMAIL);
    }

    /** Called when a password-signup collides with an existing Google-only account. */
    @Transactional
    public void issueAndSendLinkPassword(User user) {
        issue(user, TokenPurpose.LINK_PASSWORD);
    }

    /** Called from the forgot-password flow. */
    @Transactional
    public void issueAndSendPasswordReset(User user) {
        issue(user, TokenPurpose.RESET_PASSWORD);
    }

    /**
     * Validates and consumes a VERIFY_EMAIL token, marking the account verified if
     * it isn't already, and returns the user so the caller (AuthService) can issue
     * a fresh token pair - clicking the link auto-authenticates, no separate login
     * step required, even on a device that never had a session (see AuthService.verifyEmail).
     */
    @Transactional
    public User verifyEmail(String rawToken) {
        VerificationToken token = verificationTokenRepository.findByToken(rawToken)
                .orElseThrow(InvalidOrExpiredTokenException::new);

        if (token.getPurpose() != TokenPurpose.VERIFY_EMAIL || token.isExpired()) {
            throw new InvalidOrExpiredTokenException();
        }

        User user = token.getUser();

        if (token.isUsed()) {
            // Already consumed. If the account is already verified, this is a
            // replayed click - email clients pre-scanning links, a double-click,
            // or re-opening the same email - not a real security concern, so
            // treat it as an idempotent success rather than an error. A used
            // token whose user still isn't verified was consumed by something
            // else entirely and stays a genuine error.
            if (user.isEmailVerified()) {
                return user;
            }
            throw new InvalidOrExpiredTokenException();
        }

        token.setUsedAt(Instant.now());
        verificationTokenRepository.save(token);

        if (!user.isEmailVerified()) {
            user.setEmailVerified(true);
            user = userRepository.save(user);
        }

        return user;
    }

    /**
     * Validates a token for the expected purpose, marks it used, and returns it.
     * Callers (AuthService) do their own purpose-specific follow-up (set password,
     * mark verified, etc.) - this method only owns the token lifecycle.
     */
    @Transactional
    public VerificationToken consume(String rawToken, TokenPurpose expectedPurpose) {
        VerificationToken token = verificationTokenRepository.findByToken(rawToken)
                .orElseThrow(InvalidOrExpiredTokenException::new);

        if (token.isUsed() || token.isExpired() || token.getPurpose() != expectedPurpose) {
            throw new InvalidOrExpiredTokenException();
        }

        token.setUsedAt(Instant.now());
        return verificationTokenRepository.save(token);
    }

    /**
     * Deliberately silent about whether the email exists - always looks like success
     * to the caller, to avoid leaking which emails are registered. Only actually sends
     * (and rate-limits) when a matching, unverified account is found.
     */
    @Transactional
    public void resendVerifyEmail(String email) {
        Optional<User> maybeUser = userRepository.findByEmail(email.trim().toLowerCase());
        if (maybeUser.isEmpty()) {
            return;
        }

        User user = maybeUser.get();
        if (user.isEmailVerified()) {
            return;
        }

        issueAndSendVerifyEmail(user);
    }

    private void issue(User user, TokenPurpose purpose) {
        enforceCooldown(user, purpose);

        String rawToken = tokenGenerator.generate();
        VerificationToken token = VerificationToken.builder()
                .user(user)
                .token(rawToken)
                .purpose(purpose)
                .expiresAt(Instant.now().plus(properties.tokenTtl()))
                .build();

        verificationTokenRepository.save(token);
        dispatch(user, rawToken, purpose);
    }

    private void dispatch(User user, String rawToken, TokenPurpose purpose) {
        switch (purpose) {
            case VERIFY_EMAIL -> emailSender.sendVerificationEmail(user, rawToken);
            case LINK_PASSWORD -> emailSender.sendLinkPasswordEmail(user, rawToken);
            case RESET_PASSWORD -> emailSender.sendPasswordResetEmail(user, rawToken);
        }
    }

    private void enforceCooldown(User user, TokenPurpose purpose) {
        verificationTokenRepository.findTopByUserAndPurposeOrderByCreatedAtDesc(user, purpose)
                .ifPresent(lastToken -> {
                    Instant cooldownEnds = lastToken.getCreatedAt().plus(properties.resendCooldown());
                    if (Instant.now().isBefore(cooldownEnds)) {
                        long secondsLeft = Instant.now().until(cooldownEnds, ChronoUnit.SECONDS) + 1;
                        throw new TooManyRequestsException(
                                "Please wait " + secondsLeft + " seconds before requesting another email");
                    }
                });
    }
}
