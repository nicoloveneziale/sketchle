package com.sketchle.demo.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.security.core.Authentication;

import com.sketchle.demo.model.Drawing;
import com.sketchle.demo.model.Report;
import com.sketchle.demo.model.User;
import com.sketchle.demo.repository.DrawingRepository;
import com.sketchle.demo.repository.ReportRepository;
import com.sketchle.demo.repository.UserRepository;

import org.springframework.web.bind.annotation.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports", description = "Endpoints for retrieving, creating reports")
public class ReportController {
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final DrawingRepository drawingRepository;

    public ReportController(ReportRepository reportRepository, UserRepository userRepository, DrawingRepository drawingRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.drawingRepository = drawingRepository;
    }

    @PostMapping
    public ResponseEntity<?> createReport(@RequestBody Map<String, String> body, Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String drawingId = body.get("drawingId");
            String message = body.get("message");
            
            if (drawingId == null || message == null) {
                return ResponseEntity.badRequest().body("drawingId and message are required");
            }

            Drawing drawing = drawingRepository.findById(Long.parseLong(drawingId)).orElseThrow(() -> new RuntimeException("Drawing not found"));

            Report report = new Report();
            report.setUser(user);
            report.setDrawing(drawing);
            report.setMessage(message);

            reportRepository.save(report);

            return ResponseEntity.ok("Report submitted successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
