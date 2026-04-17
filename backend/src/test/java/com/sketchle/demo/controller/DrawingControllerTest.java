package com.sketchle.demo.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import com.sketchle.demo.model.Drawing;
import com.sketchle.demo.model.User;
import com.sketchle.demo.repository.DrawingRepository;
import com.sketchle.demo.repository.LikeRepository;
import com.sketchle.demo.repository.UserRepository;

import java.util.Optional;
import java.util.List;
import java.time.LocalDate;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class DrawingControllerTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private DrawingRepository drawingRepository;

    @Mock
    private LikeRepository likeRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private DrawingController drawingController;

    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetTopDrawings_ReturnsList() {
        List<Drawing> mockDrawings = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            Drawing d = new Drawing();
            d.setId((long) i);
            mockDrawings.add(d);
        }
        when(drawingRepository.findTop10ByThemeDate(LocalDate.now())).thenReturn(mockDrawings);
        List<Drawing> result = drawingController.getTopDrawings();
        assertEquals(3, result.size());
        assertEquals(0L, result.get(0).getId());
        verify(drawingRepository, times(1)).findTop10ByThemeDate(LocalDate.now());
    }

    @Test
    void testGetTopDrawings_CorrectLikeOrder() {
        List<Drawing> mockDrawings = new ArrayList<>();

        Drawing highLikes = new Drawing();
        highLikes.setId(10L);
        highLikes.setLikesCount(100);

        Drawing lowLikes = new Drawing();
        lowLikes.setId(20L);
        lowLikes.setLikesCount(10);

        mockDrawings.add(highLikes);
        mockDrawings.add(lowLikes);

        when(drawingRepository.findTop10ByThemeDate(any(LocalDate.class))).thenReturn(mockDrawings);

        List<Drawing> result = drawingController.getTopDrawings();

        assertEquals(2, result.size());
        assertEquals(10L, result.get(0).getId()); 
        assertEquals(100, result.get(0).getLikesCount());
        assertEquals(20L, result.get(1).getId()); 
    }

    @Test
    void testGetTodaysDrawings_PaginationLogic() {
        List<Drawing> drawings = List.of(new Drawing(), new Drawing());
        Page<Drawing> mockPage = new PageImpl<>(drawings, PageRequest.of(0, 12), 2);

        when(drawingRepository.findByThemeDate(eq(LocalDate.now()), any(Pageable.class)))
            .thenReturn(mockPage);
        ResponseEntity<?> response = drawingController.getTodaysDrawings(0, 12, null);

        assertEquals(200, response.getStatusCode().value());
        Page<Drawing> resultPage = (Page<Drawing>) response.getBody();
        assertEquals(2, resultPage.getContent().size());
        verify(drawingRepository).findByThemeDate(eq(LocalDate.now()), argThat(p -> 
            p.getPageNumber() == 0 && p.getPageSize() == 12
        ));
       
    }

    @Test
    void testGetTodaysDrawings_SetsLikedStatusForUser() {
        User mockUser = new User();
        mockUser.setUsername("testUser");
        Drawing drawing = new Drawing();
        drawing.setId(1L);
        
        List<Drawing> drawingList = new ArrayList<>();
        drawingList.add(drawing);
        Page<Drawing> page = new PageImpl<>(drawingList, PageRequest.of(0, 12), 1);

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("testUser");
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(mockUser));
        when(drawingRepository.findByThemeDate(any(LocalDate.class), any(Pageable.class))).thenReturn(page);
        when(likeRepository.existsByUserAndDrawing(any(User.class), any(Drawing.class))).thenReturn(true);

        ResponseEntity<?> response = drawingController.getTodaysDrawings(0, 12, authentication);
        assertEquals(200, response.getStatusCode().value(), "Expected 200 OK but got: " + response.getBody());
        Page<Drawing> result = (Page<Drawing>) response.getBody();
        assertEquals(true, result.getContent().get(0).isLikedByUser());
    }

}