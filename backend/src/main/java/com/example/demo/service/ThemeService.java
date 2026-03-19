package com.example.demo.service;

import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class ThemeService {
    private String currentTheme = "A distant galaxy";

    @Scheduled(cron = "0 0 0 * * *")
    public void updateDailyTheme() {
        ClassPathResource resource = new ClassPathResource("prompts.txt");
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()))) {
            
            List<String> lines = reader.lines().collect(Collectors.toList());
            
            if (!lines.isEmpty()) {
                Collections.shuffle(lines);
                currentTheme = lines.get(0);
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
