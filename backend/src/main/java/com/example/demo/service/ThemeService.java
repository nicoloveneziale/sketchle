package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.model.DailyTheme;
import com.example.demo.repository.ThemeRepository;

import jakarta.annotation.PostConstruct;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class ThemeService {
    @Autowired
    private ThemeRepository themeRepository;

    private String currentTheme = "A distant galaxy";

    @PostConstruct
    public void init() {
        themeRepository.findById(LocalDate.now()).ifPresent(theme -> {
            this.currentTheme = theme.getWord();
        });
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void updateDailyTheme() {
        ClassPathResource resource = new ClassPathResource("prompts.txt");
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()))) {
            
            List<String> lines = reader.lines().collect(Collectors.toList());
            
            if (!lines.isEmpty()) {
                Collections.shuffle(lines);
                currentTheme = lines.get(0);

                DailyTheme daily = new DailyTheme(LocalDate.now(), currentTheme);
                themeRepository.save(daily);
                
                System.out.println("Daily theme updated to: " + currentTheme);
            }
        } catch (Exception e) {
            System.err.println("Failed to read prompts.txt: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public String getCurrentTheme() {
        return currentTheme;
    }
}
