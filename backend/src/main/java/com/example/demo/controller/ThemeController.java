package com.example.demo.controller;

import com.example.demo.model.DailyTheme;
import com.example.demo.repository.ThemeRepository;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/theme")
@Tag(name = "Themes", description = "Endpoints for retreiving themes")
public class ThemeController {

    private final ThemeRepository themeRepository;

    public ThemeController(ThemeRepository themeRepository) {
        this.themeRepository = themeRepository;
    }

    @GetMapping("/daily")
    public ResponseEntity<DailyTheme> getDailyTheme() {
        return themeRepository.findById(LocalDate.now())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
