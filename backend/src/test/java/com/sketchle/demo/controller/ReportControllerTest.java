package com.sketchle.demo.controller;

import com.sketchle.demo.model.Drawing;
import com.sketchle.demo.model.Report;
import com.sketchle.demo.model.User;
import com.sketchle.demo.repository.DrawingRepository;
import com.sketchle.demo.repository.ReportRepository;
import com.sketchle.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ReportControllerTest {

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private DrawingRepository drawingRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ReportController reportController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateReport_Success() {
        User mockUser = new User();
        mockUser.setUsername("reporterUser");
        
        Drawing mockDrawing = new Drawing();
        mockDrawing.setId(100L);

        Map<String, String> body = new HashMap<>();
        body.put("drawingId", "100");
        body.put("message", "Inappropriate content");

        when(authentication.getName()).thenReturn("reporterUser");
        when(userRepository.findByUsername("reporterUser")).thenReturn(Optional.of(mockUser));
        when(drawingRepository.findById(100L)).thenReturn(Optional.of(mockDrawing));

        ResponseEntity<?> response = reportController.createReport(body, authentication);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Report submitted successfully", response.getBody());
        verify(reportRepository, times(1)).save(any(Report.class));
    }

    @Test
    void testCreateReport_MissingFields_ReturnsBadRequest() {
        Map<String, String> body = new HashMap<>();
        body.put("drawingId", "100");

        when(authentication.getName()).thenReturn("reporterUser");
        when(userRepository.findByUsername("reporterUser")).thenReturn(Optional.of(new User()));

        ResponseEntity<?> response = reportController.createReport(body, authentication);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("drawingId and message are required", response.getBody());
        verify(reportRepository, never()).save(any(Report.class));
    }

    @Test
    void testCreateReport_UserNotFound_ReturnsInternalError() {
        Map<String, String> body = new HashMap<>();
        body.put("drawingId", "100");
        body.put("message", "Spam");

        when(authentication.getName()).thenReturn("unknownUser");
        when(userRepository.findByUsername("unknownUser")).thenReturn(Optional.empty());

        ResponseEntity<?> response = reportController.createReport(body, authentication);

        assertEquals(500, response.getStatusCode().value());
        verify(reportRepository, never()).save(any(Report.class));
    }
}