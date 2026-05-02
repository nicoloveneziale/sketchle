package com.sketchle.demo.service;

import com.sketchle.demo.model.DailyTheme;
import com.sketchle.demo.repository.ThemeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ThemeServiceTest {

    @Mock
    private ThemeRepository themeRepository;

    @InjectMocks
    private ThemeService themeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetCurrentTheme_AlreadyInDatabase() {
        DailyTheme existingTheme = new DailyTheme(LocalDate.now(), "Mountain Sunset");
        when(themeRepository.findById(LocalDate.now())).thenReturn(Optional.of(existingTheme));

        String result = themeService.getCurrentTheme();
        assertEquals("Mountain Sunset", result);
        verify(themeRepository, never()).save(any(DailyTheme.class));
    }

    @Test
    void testGetCurrentTheme_PicksNewWhenNotFound() {
        when(themeRepository.findById(LocalDate.now())).thenReturn(Optional.empty());
        when(themeRepository.findAll()).thenReturn(List.of(new DailyTheme(LocalDate.now().minusDays(1), "Old Theme")));
        themeService.getCurrentTheme();
        verify(themeRepository, times(1)).save(any(DailyTheme.class));
    }
}