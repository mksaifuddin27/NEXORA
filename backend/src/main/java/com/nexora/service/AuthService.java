package com.nexora.service;

import com.nexora.dto.AuthRequest;
import com.nexora.dto.AuthResponse;
import com.nexora.dto.RegisterRequest;
import com.nexora.dto.UserDto;
import com.nexora.entity.User;
import com.nexora.enums.Role;
import com.nexora.exception.BadRequestException;
import com.nexora.exception.DuplicateResourceException;
import com.nexora.exception.ResourceNotFoundException;
import com.nexora.repository.UserRepository;
import com.nexora.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Enforce unique email check
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new DuplicateResourceException("An account with email " + request.getEmail() + " already exists.");
        }

        // Security rule: Public registration must NEVER permit registering as ADMIN
        Role requestedRole = request.getRole() != null ? request.getRole() : Role.USER;
        if (requestedRole == Role.ADMIN) {
            throw new BadRequestException("Administrator accounts cannot be created through public self-registration.");
        }

        User user = new User(
                request.getFullName().trim(),
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                requestedRole,
                request.getPhone()
        );

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(token, UserDto.fromEntity(savedUser), "Account created successfully.");
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        if (!user.isEnabled()) {
            throw new BadRequestException("Your account has been deactivated. Please contact administrator support.");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, UserDto.fromEntity(user), "Login successful.");
    }

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserDto.fromEntity(user);
    }
}
