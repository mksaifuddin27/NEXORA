package com.nexora.controller;

import com.nexora.dto.ApiResponse;
import com.nexora.dto.RatingDto;
import com.nexora.dto.RatingRequest;
import com.nexora.security.UserPrincipal;
import com.nexora.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RatingDto>> submitRating(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody RatingRequest request
    ) {
        RatingDto rating = ratingService.submitRating(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(rating, "Customer rating submitted successfully."));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<ApiResponse<List<RatingDto>>> getRatingsForProvider(@PathVariable Long providerId) {
        List<RatingDto> ratings = ratingService.getRatingsByProviderId(providerId);
        return ResponseEntity.ok(ApiResponse.success(ratings, "Provider reviews retrieved."));
    }
}
