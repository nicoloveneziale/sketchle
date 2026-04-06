package com.example.demo.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import com.example.demo.repository.ProfileRepository;
import com.example.demo.model.Drawing;
import com.example.demo.model.Profile;
import com.example.demo.model.User;
import com.example.demo.repository.DrawingRepository;
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

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void awardDailyBadges() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        String dateSuffix = yesterday.toString();
        List<Drawing> topDrawings = drawingRepository.findTop10ByThemeDate(yesterday);

        for (int i = 0; i < topDrawings.size(); i++) {
            Drawing post = topDrawings.get(i);
            User winner = post.getUser();
            Profile profile = profileRepository.findById(winner.getId()).orElse(null);

            if (profile != null) {
                String badgeName = "";
                if (i == 0) badgeName = "Gold " + dateSuffix;
                else if (i == 1) badgeName = "Silver " + dateSuffix;
                else if (i == 2) badgeName = "Bronze " + dateSuffix;
                else badgeName = "Top 10 " + dateSuffix;

                profile.getBadges().add(badgeName);
                profileRepository.save(profile);
            }
        }
    }
}
