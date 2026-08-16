package com.grabmyticket.auth.dto;

import java.util.List;

import org.springframework.data.domain.Page;

/** Same shape as every other service's PageResponse (booking-service, etc.) - kept consistent so the frontend's pagination handling doesn't special-case auth-service. */
public record PageResponse<T>(
        List<T> items,
        int page,
        int size,
        long totalElements,
        int totalPages
) {
    public static <T> PageResponse<T> of(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }
}
