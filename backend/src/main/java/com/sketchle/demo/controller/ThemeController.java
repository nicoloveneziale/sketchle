package com.sketchle.demo.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sketchle.demo.service.ThemeService;


@RestController
@RequestMapping("/api/theme")
@Tag(name = "Themes", description = "Endpoints for retreiving themes")
public class ThemeController {

    private final ThemeService themeService;

    public ThemeController(ThemeService themeService) {
        this.themeService = themeService;
    }

    @GetMapping("/daily")
    public ResponseEntity<String> getDailyTheme() {
        

        String theme = themeService.getCurrentTheme();
        if (theme == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(theme);
    }
}
