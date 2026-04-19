package com.sketchle.demo.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.sketchle.demo.dto.LoginRequest;
import com.sketchle.demo.dto.LoginResponse;
import com.sketchle.demo.dto.RegistrationRequest;
import com.sketchle.demo.model.User;
import com.sketchle.demo.repository.UserRepository;
import com.sketchle.demo.security.JwtService;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authorization", description = "Endpoints for submitting and retrieving users and tokens")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistrationRequest request) {
        String password = request.getPassword();
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Username already taken");
        }
        if (password == null || password.length() < 8 || password.length() > 20) {
            return ResponseEntity.badRequest().body("Password needs to be between 8 and 20 characters long");
        }
        if (!password.matches("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$")) {
            return ResponseEntity.badRequest().body("Password needs to contain at least one uppercase character, one lowercase character and one number");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
        String token = jwtService.generateToken(user.getUsername());
        return ResponseEntity.ok(new LoginResponse(token));
    }

    @PostMapping("login") 
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = userOptional.get();

        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            String token = jwtService.generateToken(user.getUsername());
            return ResponseEntity.ok(new LoginResponse(token));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Username and password do not match");
    }
}
