package com.sketchle.demo.service;

import com.sketchle.demo.model.Drawing;
import com.sketchle.demo.model.Profile;
import com.sketchle.demo.model.User;
import com.sketchle.demo.repository.DrawingRepository;
import com.sketchle.demo.repository.ProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

class BadgeServiceTest {

    @Mock
    private DrawingRepository drawingRepository;

    @Mock
    private ProfileRepository profileRepository;

    @InjectMocks
    private BadgeService badgeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAwardBadgesForDate_AssignsCorrectBadges() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        List<Drawing> mockTopDrawings = new ArrayList<>();

        for (int i = 0; i < 3; i++) {
            User user = new User();
            user.setId((long) i);
            
            Drawing drawing = new Drawing();
            drawing.setUser(user);
            mockTopDrawings.add(drawing);

            Profile profile = new Profile();
            profile.setBadges(new ArrayList<>());
            when(profileRepository.findById((long) i)).thenReturn(Optional.of(profile));
        }

        when(drawingRepository.findTop10ByThemeDate(yesterday)).thenReturn(mockTopDrawings);

        badgeService.awardDailyBadges();

        verify(profileRepository, times(3)).save(any(Profile.class));
        
        Optional<Profile> goldProfileOpt = profileRepository.findById(0L);
        assertTrue(goldProfileOpt.get().getBadges().get(0).contains("Gold"));
    }

    @Test
    void testAwardMissedBadges_DoesNotDuplicate() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        User winner = new User();
        winner.setId(1L);
        
        Drawing drawing = new Drawing();
        drawing.setUser(winner);
        
        Profile profile = new Profile();
        profile.setBadges(List.of("Gold " + yesterday.toString()));

        when(drawingRepository.findTop10ByThemeDate(yesterday)).thenReturn(List.of(drawing));
        when(profileRepository.findById(1L)).thenReturn(Optional.of(profile));

        badgeService.awardMissedBadges();
        verify(profileRepository, never()).save(any(Profile.class));
    }
}