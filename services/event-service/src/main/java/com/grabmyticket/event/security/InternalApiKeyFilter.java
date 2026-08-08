package com.grabmyticket.event.security;

import java.io.IOException;
import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Authenticates server-to-server calls on /internal/** via a shared secret
 * header instead of a user JWT - there's no user in the loop for a seat
 * reserve/release call from booking-service. Only acts on /internal/**;
 * every other path is untouched and still relies on JwtAuthenticationFilter.
 */
@Component
public class InternalApiKeyFilter extends OncePerRequestFilter {

    private static final String HEADER = "X-Internal-Api-Key";

    private final InternalApiKeyProperties properties;

    public InternalApiKeyFilter(InternalApiKeyProperties properties) {
        this.properties = properties;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        if (request.getRequestURI().startsWith("/internal/")) {
            String provided = request.getHeader(HEADER);
            if (provided != null && !provided.isBlank() && provided.equals(properties.secret())) {
                var authentication = new UsernamePasswordAuthenticationToken(
                        "internal-service", null, List.of(new SimpleGrantedAuthority("ROLE_INTERNAL_SERVICE")));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }
}
