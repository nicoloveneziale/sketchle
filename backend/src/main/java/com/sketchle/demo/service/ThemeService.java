package com.sketchle.demo.service;

import com.sketchle.demo.model.DailyTheme;
import com.sketchle.demo.repository.ThemeRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ThemeService {

    @Autowired
    private ThemeRepository themeRepository;
    // Default theme when no themes left
    private String currentTheme = "A distant galaxy";

    @PostConstruct
    public void init() {
        themeRepository.findById(LocalDate.now()).ifPresentOrElse( // Checks if theres already a theme for today
            theme -> this.currentTheme = theme.getWord(), // Gets the theme stored in DB
            this::pickNewTheme // Else calls pickNewTheme
        );
    }

    private void pickNewTheme() {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new ClassPathResource("prompts.txt").getInputStream()))) { // Reads from prompts.txt line by line

            Set<String> usedWords = themeRepository.findAll() // Gets all themes used from DB
                .stream()
                .map(DailyTheme::getWord)
                .collect(Collectors.toSet());

            List<String> available = reader.lines()
                .filter(line -> !line.isBlank()) // Non empty line
                .filter(line -> !usedWords.contains(line.trim())) // DB doesnt contain theme already
                .collect(Collectors.toList());

            if (available.isEmpty()) { // If no themes are unused
                System.err.println("No unused prompts left!");
                return;
            }

            java.util.Collections.shuffle(available); // Randomise the themes
            this.currentTheme = available.get(0); 

            DailyTheme daily = new DailyTheme(LocalDate.now(), currentTheme); // Creates theme object model
            themeRepository.save(daily); // Save to DB

            System.out.println("Daily theme set to: " + currentTheme);
        } catch (Exception e) {
            System.err.println("Failed to read prompts.txt: " + e.getMessage());
        }
    }

    public String getCurrentTheme() {
        themeRepository.findById(LocalDate.now()).ifPresentOrElse(
            theme -> this.currentTheme = theme.getWord(), // Gets current theme from today in DB
            this::pickNewTheme // Else gets new theme from function above
        );
        return currentTheme;
    }
}