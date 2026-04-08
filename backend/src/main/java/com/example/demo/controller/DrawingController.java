package com.example.demo.controller;

import com.example.demo.model.Drawing;
import com.example.demo.model.DrawingLike;
import com.example.demo.model.User;
import com.example.demo.model.DailyTheme;
import com.example.demo.repository.DrawingRepository;
import com.example.demo.repository.LikeRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.ThemeRepository;
import com.example.demo.service.SupabaseStorageService;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/drawings")
@Tag(name = "Drawings", description = "Endpoints for submitting and retrieving sketches")
public class DrawingController {

    private final DrawingRepository drawingRepository;
    private final UserRepository userRepository;
    private final ThemeRepository themeRepository;
    private final LikeRepository likeRepository;
    private final SupabaseStorageService storageService; 
    public DrawingController(DrawingRepository drawingRepository, 
                             UserRepository userRepository, 
                             LikeRepository likeRepository,
                             ThemeRepository themeRepository,
                             SupabaseStorageService storageService) { 
        this.drawingRepository = drawingRepository;
        this.userRepository = userRepository;
        this.themeRepository = themeRepository;
        this.likeRepository = likeRepository;
        this.storageService = storageService;
    }

    @GetMapping("/top")
        public List<Drawing> getTopDrawings() {
        return drawingRepository.findTop10ByThemeDate(LocalDate.now());
    }

    @GetMapping("/today")
    public ResponseEntity<?> getTodaysDrawings(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "12") int size, Authentication authentication) {
        try {
            LocalDate today = LocalDate.now();
            Pageable pageable = PageRequest.of(page, size, Sort.by("submittedAt").descending());
            Page<Drawing> drawingPage = drawingRepository.findByThemeDate(today, pageable);

            if (authentication != null && authentication.isAuthenticated()) {
                User currentUser = userRepository.findByUsername(authentication.getName()).orElse(null);
                if (currentUser != null) {
                    drawingPage.forEach(drawing -> {
                    boolean liked = likeRepository.existsByUserAndDrawing(currentUser, drawing);
                    drawing.setLikedByUser(liked); 
                    });
                }
            }
            return ResponseEntity.ok(drawingPage);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUserDrawings(@PathVariable String username) {
        try {
            User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User " + username + " cannot be found"));

            List<Drawing> userDrawings = drawingRepository.findByUserOrderBySubmittedAtDesc(user);
            return ResponseEntity.ok(userDrawings);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
        return ResponseEntity.internalServerError().body("Error fetching user posts: " + e.getMessage());
        }
    }

    @GetMapping("/submission")
    public ResponseEntity<?> getSubmission(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.ok().build(); 
            }
            String username = authentication.getName();
            User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
            Drawing drawing = drawingRepository.findByUserAndThemeDate(user, LocalDate.now());

            if (drawing == null) {
                return ResponseEntity.ok().build();
            }

            return ResponseEntity.ok(drawing);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Could not find submission");
        }
    }

    @DeleteMapping("/{drawingId}")
    public ResponseEntity<?> deleteDrawing(@PathVariable Long drawingId, Authentication authentication) {
        try {
            Drawing drawing = drawingRepository.findById(drawingId).orElseThrow(() -> new RuntimeException("Drawing not found"));

            String username = authentication.getName();
            if (!drawing.getUser().getUsername().equals(username)) {
                return ResponseEntity.status(403).body("You are not authorized to delete this drawing");
            }
            drawingRepository.delete(drawing);
            return ResponseEntity.ok("Drawing deleted successfully");
        } catch (Exception e) {
        return ResponseEntity.internalServerError().body("Delete failed: " + e.getMessage());
    }
    }
    
    @PostMapping(value = "/submit", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> submitDrawing(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file, 
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            DailyTheme theme = themeRepository.findById(LocalDate.now())
                    .orElse(null);

            if (theme == null) {
                return ResponseEntity.badRequest().body("No theme found for today!");
            }

            byte[] imageBytes = file.getBytes();
            String imageUrl = storageService.uploadDrawing(imageBytes, username);

            Drawing drawing = new Drawing();
            drawing.setUser(user);
            drawing.setTheme(theme);
            drawing.setDrawingUrl(imageUrl);
            drawing.setSubmittedAt(LocalDateTime.now());
            
            drawing.setLikesCount(0); 

            drawingRepository.save(drawing);

            return ResponseEntity.ok("Drawing uploaded successfully! URL: " + imageUrl);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing upload: " + e.getMessage());
        }
    }

    @PostMapping("/{drawingId}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long drawingId, Authentication authentication) {
    try {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new RuntimeException("User not found"));
        
        Drawing drawing = drawingRepository.findById(drawingId).orElseThrow(() -> new RuntimeException("Drawing not found"));

        Optional<DrawingLike> existingLike = likeRepository.findByUserAndDrawing(user, drawing);

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            return ResponseEntity.ok("Unliked");
        } else {
            likeRepository.save(new DrawingLike(user, drawing));
            return ResponseEntity.ok("Liked");
        }
    } catch (Exception e) {
        return ResponseEntity.internalServerError().body(e.getMessage());
    }
}
}