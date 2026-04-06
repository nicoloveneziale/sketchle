package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.model.Profile;
import com.example.demo.repository.ProfileRepository;
import com.example.demo.repository.UserRepository;
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

class ProfileControllerTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ProfileController profileController;

    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);
    }

    @Test 
    void testCreateProfile_Success() {
        String username = "testUsername";
        User mockUser = new User();
        mockUser.setId(100L);
        mockUser.setUsername(username);

        when(authentication.getName()).thenReturn(username);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));
        when(profileRepository.existsById(100L)).thenReturn(false);

        Map<String, String> body = new HashMap<>();
        body.put("bio", "hello world");
        ResponseEntity<?> response = profileController.createProfile(body, authentication);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Profile created successfully", response.getBody());

        verify(profileRepository, times(1)).save(any(Profile.class));
    }

    @Test
    void testGetProfile_Success() {
        String username = "testUsername";
        User mockUser = new User();
        mockUser.setUsername(username);
        Profile mockProfile = new Profile(mockUser);
        mockProfile.setBio("This is my bio");

        when(profileRepository.findByUser_Username(username)).thenReturn(Optional.of(mockProfile));

        ResponseEntity<?> response = profileController.getProfile(username);
        assertEquals(200, response.getStatusCode().value());
        Profile returnedProfile = (Profile) response.getBody();
        assertEquals("This is my bio", returnedProfile.getBio());
    }

    @Test
    void testGetProfile_NotFound() {
        String username = "ghostUser";
        when(profileRepository.findByUser_Username(username)).thenReturn(Optional.empty());
        ResponseEntity<?> response = profileController.getProfile(username);
        assertEquals(404, response.getStatusCode().value());
    }

    @Test
    void testUpdateProfile_UsernameAlreadyTaken() {
        String currentUsername = "originalUser";
        String takenUsername = "alreadyExists";

        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setUsername(currentUsername);

        when(authentication.getName()).thenReturn(currentUsername);
        when(userRepository.findByUsername(currentUsername)).thenReturn(Optional.of(mockUser));
        when(userRepository.existsByUsername(takenUsername)).thenReturn(true);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("username", takenUsername);
        requestBody.put("bio", "New Bio");

        ResponseEntity<?> response = profileController.updateProfile(requestBody, authentication);
        
        assertEquals(400, response.getStatusCode().value());
        assertEquals("Username already taken", response.getBody());

        verify(userRepository, never()).save(any());
    }

    @Test
    void testUpdateProfile_Success() {
        String currentUsername = "user1";
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setUsername(currentUsername);
        
        Profile mockProfile = new Profile(mockUser);

        when(authentication.getName()).thenReturn(currentUsername);
        when(userRepository.findByUsername(currentUsername)).thenReturn(Optional.of(mockUser));
        when(profileRepository.findById(1L)).thenReturn(Optional.of(mockProfile));

        Map<String, String> body = new HashMap<>();
        body.put("bio", "Updated Bio!");
        ResponseEntity<?> response = profileController.updateProfile(body, authentication);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Updated Bio!", mockProfile.getBio());
        verify(profileRepository, times(1)).save(mockProfile);
    }
}