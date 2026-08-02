package com.grabmyticket.auth.security;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.net.URLEncoder;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.grabmyticket.auth.entity.User;
import com.grabmyticket.auth.service.GoogleAuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Runs once Spring Security has completed the Google OAuth2 handshake and
 * resolved the user's Google profile. Finds/creates our local User, issues
 * OUR OWN JWT (not Google's token - downstream services only ever trust
 * tokens signed by JwtService), and redirects the browser back to the
 * frontend with that JWT in the URL, since a top-level redirect can't
 * return JSON.
 */
@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final GoogleAuthService googleAuthService;
    private final JwtService jwtService;
    private final String frontendBaseUrl;

    public OAuth2LoginSuccessHandler(
            GoogleAuthService googleAuthService,
            JwtService jwtService,
            @Value("${app.frontend-base-url:http://localhost:3000}") String frontendBaseUrl
    ) {
        this.googleAuthService = googleAuthService;
        this.jwtService = jwtService;
        this.frontendBaseUrl = frontendBaseUrl;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {
        OAuth2User oAuth2User = ((OAuth2AuthenticationToken) authentication).getPrincipal();

        String googleSub = oAuth2User.getAttribute("sub");
        String email = oAuth2User.getAttribute("email");
        String fullName = oAuth2User.getAttribute("name");

        User user = googleAuthService.findOrCreateUser(googleSub, email, fullName);
        String accessToken = jwtService.generateAccessToken(user);

        String redirectUrl = frontendBaseUrl + "/oauth2/callback?token="
                + URLEncoder.encode(accessToken, StandardCharsets.UTF_8)
                + "&expiresIn=" + jwtService.getAccessTokenTtlSeconds();

        response.sendRedirect(redirectUrl);
    }
}
