package com.example.demo.controller;

import com.example.demo.model.Profile;
import com.example.demo.model.User;
import com.example.demo.repository.ProfileRepository;
import com.example.demo.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileController(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createProfile(@RequestBody Map<String, String> body, Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (profileRepository.existsById(user.getId())) {
                return ResponseEntity.badRequest().body("Profile already taken");
            }

            Profile profile = new Profile(user);
            profile.setBio(body.getOrDefault("bio", "Default bio..."));
            
            profileRepository.save(profile);
            return ResponseEntity.ok("Profile created successfully");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getProfile(@PathVariable String username) {
        return profileRepository.findByUser_Username(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update")
    @Transactional
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> body, Authentication authentication) {
        try {
            String currentUsername = authentication.getName();
            User user = userRepository.findByUsername(currentUsername).orElseThrow(() -> new RuntimeException("User is not found"));

            String newUsername = body.get("username");
            if (newUsername != null && !newUsername.isBlank() && !newUsername.equals(currentUsername)) {
                if (userRepository.existsByUsername(newUsername)){
                    return ResponseEntity.badRequest().body("Username already taken");
                }
                 user.setUsername(newUsername);
                userRepository.save(user);
            }

            String newBio = body.get("bio");
            Profile profile = profileRepository.findById(user.getId()).orElseThrow(() -> new RuntimeException("Profile is not found for this user"));

            if (newBio != null) {
                profile.setBio(newBio);
                profileRepository.save(profile);
            }

            return ResponseEntity.ok(Map.of(
            "message", "Profile updated successfully",
            "newUsername", user.getUsername()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating profile: " + e.getMessage());
        }
    }
}