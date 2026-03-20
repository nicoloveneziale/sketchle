package com.example.demo.dto;

import java.time.LocalDateTime;

public record DrawingDTO(
    Long id,
    String imageUrl,
    String userId,
    Long themeId,
    Integer likesCount,
    LocalDateTime createdAt
) {}
