package com.grabmyticket.auth.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    /** Generates a token, persists it, and hands it to the email sender. Called right after signup. */
    @Transactional
    public void issueAndSend(User user) {
        String rawToken = tokenGenerator.generate();

        VerificationToken token = VerificationToken.builder()
                .user(user)
                .token(rawToken)
                .expiresAt(Instant.now().plus(properties.tokenTtl()))
                .build();

        verificationTokenRepository.save(token);
        emailSender.sendVerificationEmail(user, rawToken);
    }

    @Transactional
    public void verify(String rawToken) {
        VerificationToken token = verificationTokenRepository.findByToken(rawToken)
                .orElseThrow(InvalidOrExpiredTokenException::new);

        if (token.isUsed() || token.isExpired()) {
            throw new InvalidOrExpiredTokenException();
        }

        User user = token.getUser();
        if (!user.isEmailVerified()) {
            user.setEmailVerified(true);
            userRepository.save(user);
        }

        token.setUsedAt(Instant.now());
        verificationTokenRepository.save(token);
    }

    /**
     * Deliberately silent about whether the email exists - always looks like success
     * to the caller, to avoid leaking which emails are registered. Only actually sends
     * (and rate-limits) when a matching, unverified account is found.
     */
    @Transactional
    public void resend(String email) {
        Optional<User> maybeUser = userRepository.findByEmail(email.trim().toLowerCase());
        if (maybeUser.isEmpty()) {
            return;
        }

        User user = maybeUser.get();
        if (user.isEmailVerified()) {
            return;
        }

        verificationTokenRepository.findTopByUserOrderByCreatedAtDesc(user)
                .ifPresent(lastToken -> {
                    Instant cooldownEnds = lastToken.getCreatedAt().plus(properties.resendCooldown());
                    if (Instant.now().isBefore(cooldownEnds)) {
                        long secondsLeft = Instant.now().until(cooldownEnds, ChronoUnit.SECONDS) + 1;
                        throw new TooManyRequestsException(
                                "Please wait " + secondsLeft + " seconds before requesting another verification email");
                    }
                });

        issueAndSend(user);
    }
}
