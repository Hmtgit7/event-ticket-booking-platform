package com.grabmyticket.auth.service;

import java.time.Instant;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.auth.entity.RefreshToken;
import com.grabmyticket.auth.entity.User;
import com.grabmyticket.auth.exception.InvalidRefreshTokenException;
import com.grabmyticket.auth.repository.RefreshTokenRepository;
import com.grabmyticket.auth.security.JwtProperties;
import com.grabmyticket.auth.security.TokenGenerator;
import com.grabmyticket.auth.security.TokenHasher;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final TokenGenerator tokenGenerator;
    private final TokenHasher tokenHasher;
    private final JwtProperties jwtProperties;

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository,
            TokenGenerator tokenGenerator,
            TokenHasher tokenHasher,
            JwtProperties jwtProperties
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.tokenGenerator = tokenGenerator;
        this.tokenHasher = tokenHasher;
        this.jwtProperties = jwtProperties;
    }

    /** Issues a brand new refresh token for a user (signup, login, google login). Returns the RAW token. */
    @Transactional
    public String issue(User user) {
        return createToken(user).rawToken();
    }

    /**
     * Validates the presented refresh token and, if valid, rotates it: the old one is
     * revoked (and linked via replacedBy), a new one is issued. Returns the user + new raw token.
     *
     * Reuse detection: if the presented token was already revoked (meaning it was already
     * rotated once before), that's a strong signal someone is replaying a stolen token -
     * ALL of that user's active refresh tokens are revoked immediately to contain it.
     */
    @Transactional
    public RotationResult rotate(String rawRefreshToken) {
        RefreshToken existing = refreshTokenRepository.findByTokenHash(tokenHasher.hash(rawRefreshToken))
                .orElseThrow(InvalidRefreshTokenException::new);

        if (existing.getRevokedAt() != null) {
            revokeAllActiveTokensForInternal(existing.getUser());
            throw new InvalidRefreshTokenException();
        }
        if (Instant.now().isAfter(existing.getExpiresAt())) {
            throw new InvalidRefreshTokenException();
        }

        User user = existing.getUser();
        if (!user.isEnabled()) {
            // Defense in depth - suspendUser already revokes every active token
            // synchronously, so this branch should rarely fire, but a token
            // presented in the narrow window between the DB write and this
            // check should still be rejected outright, not rotated into a
            // fresh one.
            throw new InvalidRefreshTokenException();
        }
        IssuedToken next = createToken(user);

        existing.setRevokedAt(Instant.now());
        existing.setReplacedBy(next.entity().getId());
        refreshTokenRepository.save(existing);

        return new RotationResult(user, next.rawToken());
    }

    /** Revoke-on-logout. Silently no-ops on an unknown/already-revoked token - logout must be idempotent. */
    @Transactional
    public void revoke(String rawRefreshToken) {
        refreshTokenRepository.findByTokenHash(tokenHasher.hash(rawRefreshToken))
                .filter(token -> token.getRevokedAt() == null)
                .ifPresent(token -> {
                    token.setRevokedAt(Instant.now());
                    refreshTokenRepository.save(token);
                });
    }

    /** Called by AdminUserService.suspendUser - boots the account out immediately rather than waiting for their current access token to expire naturally. Public (unlike the reuse-detection path in rotate(), which stays private) since this is invoked from outside this class. */
    @Transactional
    public void revokeAllActiveTokensFor(User user) {
        revokeAllActiveTokensForInternal(user);
    }

    private void revokeAllActiveTokensForInternal(User user) {
        Instant now = Instant.now();
        refreshTokenRepository.findByUserAndRevokedAtIsNull(user)
                .forEach(token -> token.setRevokedAt(now));
        // Dirty entities are flushed automatically at transaction commit (still inside @Transactional).
    }

    private IssuedToken createToken(User user) {
        String raw = tokenGenerator.generate();
        RefreshToken entity = RefreshToken.builder()
                .user(user)
                .tokenHash(tokenHasher.hash(raw))
                .expiresAt(Instant.now().plus(jwtProperties.refreshTokenTtl()))
                .build();
        entity = refreshTokenRepository.save(entity);
        return new IssuedToken(raw, entity);
    }

    private record IssuedToken(String rawToken, RefreshToken entity) {
    }

    public record RotationResult(User user, String rawRefreshToken) {
    }
}
