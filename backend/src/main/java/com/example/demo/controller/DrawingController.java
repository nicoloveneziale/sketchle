package com.example.demo.controller;

import com.example.demo.dto.DrawingRequest;
import com.example.demo.model.Drawing;
import com.example.demo.model.User;
import com.example.demo.model.DailyTheme;
import com.example.demo.repository.DrawingRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.ThemeRepository;
import com.example.demo.service.SupabaseStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/drawings")
public class DrawingController {

    private final DrawingRepository drawingRepository;
    private final UserRepository userRepository;
    private final ThemeRepository themeRepository;
    private final SupabaseStorageService storageService; 
    public DrawingController(DrawingRepository drawingRepository, 
                             UserRepository userRepository, 
                             ThemeRepository themeRepository,
                             SupabaseStorageService storageService) { 
        this.drawingRepository = drawingRepository;
        this.userRepository = userRepository;
        this.themeRepository = themeRepository;
        this.storageService = storageService;
    }

    @GetMapping("/today")
    public ResponseEntity<?> getTodaysDrawings() {
        try {
            LocalDate today = LocalDate.now();

            System.out.println(today);
            
            List<Drawing> drawings = drawingRepository.findByThemeDateOrderBySubmittedAtDesc(today);

            if (drawings.isEmpty()) {
                return ResponseEntity.ok("No drawings found for today's theme yet.");
            }

            return ResponseEntity.ok(drawings);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
    

    @PostMapping("/submit")
    public ResponseEntity<?> submitDrawing(@RequestBody DrawingRequest request, Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            DailyTheme theme = themeRepository.findById(LocalDate.now())
                    .orElse(null);

            if (theme == null) {
                return ResponseEntity.badRequest().body("No theme found for today!");
            }

            String imageUrl = storageService.uploadDrawing(request.getPixelData(), username);

            Drawing drawing = new Drawing();
            drawing.setUser(user);
            drawing.setTheme(theme);
            drawing.setDrawingUrl(imageUrl);
            drawing.setSubmittedAt(LocalDateTime.now());

            drawingRepository.save(drawing);

            return ResponseEntity.ok("Drawing uploaded to Supabase! URL: " + imageUrl);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing drawing: " + e.getMessage());
        }
    }
}