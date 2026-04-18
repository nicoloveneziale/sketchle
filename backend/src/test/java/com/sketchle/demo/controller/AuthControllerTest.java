package com.sketchle.demo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sketchle.demo.dto.LoginRequest;
import com.sketchle.demo.dto.RegistrationRequest;
import com.sketchle.demo.repository.UserRepository;
import com.sketchle.demo.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import com.sketchle.demo.model.User;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@AutoConfigureJsonTesters
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private PasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void shouldRegisterUserSuccessfully() throws Exception {
        RegistrationRequest request = new RegistrationRequest("new_user", "Password123");
        given(userRepository.existsByUsername("new_user")).willReturn(false);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void shouldFailRegistrationWhenePasswordTooShort() throws Exception {
        RegistrationRequest invalidRequest = new RegistrationRequest("new_user", "Pw1");
        given(userRepository.existsByUsername("new_user")).willReturn(false);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldFailRegistrationWhenePasswordNotContainUpperCharOrNum() throws Exception {
        RegistrationRequest invalidRequest = new RegistrationRequest("new_user", "password");
        given(userRepository.existsByUsername("new_user")).willReturn(false);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldFailRegistrationWhenUsernameAlreadyExists() throws Exception {
        RegistrationRequest invalidRequest = new RegistrationRequest("existing_username", "Password123");
        given(userRepository.existsByUsername("existing_username")).willReturn(true);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    void shouldLoginSuccessfully() throws Exception {
        String username = "test_user";
        LoginRequest loginRequest = new LoginRequest(username, "Password123");
        
        given(userRepository.existsByUsername(username)).willReturn(true); 
        given(jwtService.generateToken(username)).willReturn("fake-jwt-token");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"));
    }

    @Test
    void shouldFailLoginWithWrongPassword() throws Exception {
        String username = "test_user";
        String invalidPassword = "WrongPassword123"; 
        LoginRequest loginRequest = new LoginRequest(username, invalidPassword);

        User mockUser = new User();
        mockUser.setUsername(username);
        mockUser.setPassword("encoded_correct_password");
        
        given(userRepository.findByUsername(username)).willReturn(Optional.of(mockUser));
        given(passwordEncoder.matches(invalidPassword, "encoded_correct_password")).willReturn(false);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }
}