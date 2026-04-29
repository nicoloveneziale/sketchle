package com.sketchle.demo.service;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.sketchle.demo.model.Drawing;
import com.sketchle.demo.model.Profile;
import com.sketchle.demo.model.User;
import com.sketchle.demo.repository.DrawingRepository;
import com.sketchle.demo.repository.ProfileRepository;

import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BadgeService {
    private final DrawingRepository drawingRepository;
    private final ProfileRepository profileRepository;

    public BadgeService(DrawingRepository drawingRepository, ProfileRepository profileRepository) {
        this.drawingRepository = drawingRepository;
        this.profileRepository = profileRepository;
    }

    @EventListener(ApplicationReadyEvent.class) // Runs after everything is set up
    @Transactional
    public void init() {
        try {
            awardMissedBadges();
        } catch (Exception e) {
            System.err.println("Badge init failed: " + e.getMessage());
        }
    }

    @Transactional // DB either does all or nothing
    public void awardMissedBadges() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        List<Drawing> topDrawings = drawingRepository.findTop10ByThemeDate(yesterday);

        if (topDrawings.isEmpty()) return; // Checks if empty

        // Gets yesterdays winner, if they do not have a badge we assume no one else does, so then we call to award the badges for yesterday
        Drawing first = topDrawings.get(0); 
        User winner = first.getUser();
        Profile profile = profileRepository.findById(winner.getId()).orElse(null);
        if (profile != null && profile.getBadges().stream().anyMatch(b -> b.contains(yesterday.toString()))) {
            return; 
        }

        awardBadgesForDate(yesterday);
    }

    @Scheduled(cron = "0 0 0 * * *") // Runs every midnight
    @Transactional
    public void awardDailyBadges() {
        awardBadgesForDate(LocalDate.now().minusDays(1));
    }

    private void awardBadgesForDate(LocalDate date) {
        String dateSuffix = date.toString();
        List<Drawing> topDrawings = drawingRepository.findTop10ByThemeDate(date);

        for (int i = 0; i < topDrawings.size(); i++) { // Gets each place
            Drawing post = topDrawings.get(i);
            User winner = post.getUser(); // Gets each user
            Profile profile = profileRepository.findById(winner.getId()).orElse(null); // Gets each profile fo the user

            if (profile != null) {
                String badgeName; // Badge dependent on where they placed
                if (i == 0) badgeName = "Gold " + dateSuffix;
                else if (i == 1) badgeName = "Silver " + dateSuffix;
                else if (i == 2) badgeName = "Bronze " + dateSuffix;
                else badgeName = "Top 10 " + dateSuffix;

                if (!profile.getBadges().contains(badgeName)) { // If users dont already have the badge, we add it and save to DB
                    profile.getBadges().add(badgeName);
                    profileRepository.save(profile);
                }
            }
        }
        System.out.println("Badges awarded for: " + dateSuffix);
    }
}