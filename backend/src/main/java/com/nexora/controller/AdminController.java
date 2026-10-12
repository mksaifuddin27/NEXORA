package com.nexora.controller;

import com.nexora.dto.ApiResponse;
import com.nexora.dto.BookingDto;
import com.nexora.dto.ProviderDto;
import com.nexora.dto.RatingDto;
import com.nexora.dto.SystemStatsDto;
import com.nexora.dto.UserDto;
import com.nexora.entity.Category;
import com.nexora.entity.Report;
import com.nexora.enums.ReportStatus;
import com.nexora.enums.VerificationStatus;
import com.nexora.service.AdminService;
import com.nexora.service.BookingService;
import com.nexora.service.CategoryService;
import com.nexora.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final CategoryService categoryService;
    private final BookingService bookingService;
    private final RatingService ratingService;

    public AdminController(
            AdminService adminService,
            CategoryService categoryService,
            BookingService bookingService,
            RatingService ratingService
    ) {
        this.adminService = adminService;
        this.categoryService = categoryService;
        this.bookingService = bookingService;
        this.ratingService = ratingService;
    }

    @GetMapping({"/stats", "/overview"})
    public ResponseEntity<ApiResponse<SystemStatsDto>> getStats() {
        SystemStatsDto stats = adminService.getSystemStats();
        return ResponseEntity.ok(ApiResponse.success(stats, "Platform statistics retrieved."));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users, "User accounts retrieved."));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserDto>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body
    ) {
        boolean enabled = body.getOrDefault("enabled", true);
        UserDto updated = adminService.updateUserStatus(id, enabled);
        return ResponseEntity.ok(ApiResponse.success(updated, "User status updated."));
    }

    @GetMapping("/providers")
    public ResponseEntity<ApiResponse<List<ProviderDto>>> getAllProviders() {
        List<ProviderDto> providers = adminService.getAllProviders();
        return ResponseEntity.ok(ApiResponse.success(providers, "Providers retrieved."));
    }

    @PutMapping("/providers/{id}/verification")
    public ResponseEntity<ApiResponse<ProviderDto>> updateProviderVerification(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String statusStr = body.get("status");
        VerificationStatus status = VerificationStatus.valueOf(statusStr.toUpperCase());
        ProviderDto updated = adminService.updateProviderVerification(id, status);
        return ResponseEntity.ok(ApiResponse.success(updated, "Provider verification status updated to " + status + "."));
    }

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<Category>> createCategory(@Valid @RequestBody Category category) {
        Category created = categoryService.createCategory(category);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Category created successfully."));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Category>> deactivateCategory(@PathVariable Long id) {
        Category deactivated = categoryService.deactivateCategory(id);
        return ResponseEntity.ok(ApiResponse.success(deactivated, "Category deactivated."));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getAllBookings() {
        List<BookingDto> bookings = bookingService.getAllBookingsForAdmin();
        return ResponseEntity.ok(ApiResponse.success(bookings, "All platform bookings retrieved."));
    }

    @GetMapping("/ratings")
    public ResponseEntity<ApiResponse<List<RatingDto>>> getAllRatings() {
        List<RatingDto> ratings = ratingService.getAllRatingsForAdmin();
        return ResponseEntity.ok(ApiResponse.success(ratings, "All platform reviews retrieved."));
    }

    @DeleteMapping("/ratings/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRating(@PathVariable Long id) {
        ratingService.deleteRatingByAdmin(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Review moderated and removed by administrator."));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<List<Report>>> getAllReports() {
        List<Report> reports = adminService.getAllReports();
        return ResponseEntity.ok(ApiResponse.success(reports, "Platform reports retrieved."));
    }

    @PutMapping("/reports/{id}/resolve")
    public ResponseEntity<ApiResponse<Report>> resolveReport(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String statusStr = body.getOrDefault("status", "RESOLVED");
        ReportStatus status = ReportStatus.valueOf(statusStr.toUpperCase());
        Report resolved = adminService.resolveReport(id, status);
        return ResponseEntity.ok(ApiResponse.success(resolved, "Report updated to " + status + "."));
    }
}
