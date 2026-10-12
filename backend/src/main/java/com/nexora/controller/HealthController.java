package com.nexora.controller;

import com.nexora.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealth() {
        Map<String, Object> healthInfo = Map.of(
                "status", "UP",
                "service", "NEXORA Smart Local Service Discovery API",
                "version", "1.0.0",
                "framework", "Spring Boot 3.3.5",
                "database", "MySQL 8.0"
        );
        return ResponseEntity.ok(ApiResponse.success(healthInfo, "Service is healthy and reachable"));
    }
}
