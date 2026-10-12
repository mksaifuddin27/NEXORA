package com.nexora.controller;

import com.nexora.dto.*;
import com.nexora.enums.BookingStatus;
import com.nexora.security.UserPrincipal;
import com.nexora.service.AvailabilityService;
import com.nexora.service.BookingService;
import com.nexora.service.OfficerService;
import com.nexora.service.ServiceItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/officer")
@PreAuthorize("hasAnyRole('OFFICER', 'ADMIN')")
public class OfficerController {

    private final OfficerService officerService;
    private final ServiceItemService serviceItemService;
    private final AvailabilityService availabilityService;
    private final BookingService bookingService;

    public OfficerController(
            OfficerService officerService,
            ServiceItemService serviceItemService,
            AvailabilityService availabilityService,
            BookingService bookingService
    ) {
        this.officerService = officerService;
        this.serviceItemService = serviceItemService;
        this.availabilityService = availabilityService;
        this.bookingService = bookingService;
    }

    @GetMapping({"/provider", "/my-provider"})
    public ResponseEntity<ApiResponse<ProviderDto>> getMyProvider(@AuthenticationPrincipal UserPrincipal principal) {
        ProviderDto provider = officerService.getOfficerProvider(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(provider, "Officer provider profile retrieved."));
    }

    @PostMapping("/provider")
    public ResponseEntity<ApiResponse<ProviderDto>> createProvider(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ProviderRequest request
    ) {
        ProviderDto created = officerService.createProviderForOfficer(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Provider profile created."));
    }

    @PutMapping("/provider/{id}")
    public ResponseEntity<ApiResponse<ProviderDto>> updateProvider(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody ProviderRequest request
    ) {
        ProviderDto updated = officerService.updateProviderProfile(principal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Provider profile updated."));
    }

    @PostMapping("/provider/{providerId}/services")
    public ResponseEntity<ApiResponse<ServiceDto>> addService(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long providerId,
            @Valid @RequestBody ServiceRequest request
    ) {
        ServiceDto created = serviceItemService.createService(principal.getId(), providerId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Service offering added."));
    }

    @PutMapping("/services/{serviceId}")
    public ResponseEntity<ApiResponse<ServiceDto>> updateService(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long serviceId,
            @Valid @RequestBody ServiceRequest request
    ) {
        ServiceDto updated = serviceItemService.updateService(principal.getId(), serviceId, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Service offering updated."));
    }

    @DeleteMapping("/services/{serviceId}")
    public ResponseEntity<ApiResponse<Void>> deleteService(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long serviceId
    ) {
        serviceItemService.deleteService(principal.getId(), serviceId);
        return ResponseEntity.ok(ApiResponse.success(null, "Service offering deleted."));
    }

    @PostMapping("/provider/{providerId}/slots")
    public ResponseEntity<ApiResponse<AvailabilityDto>> addSlot(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long providerId,
            @Valid @RequestBody AvailabilityRequest request
    ) {
        AvailabilityDto created = availabilityService.createSlot(principal.getId(), providerId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Availability slot added."));
    }

    @DeleteMapping("/slots/{slotId}")
    public ResponseEntity<ApiResponse<Void>> deleteSlot(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long slotId
    ) {
        availabilityService.deleteSlot(principal.getId(), slotId);
        return ResponseEntity.ok(ApiResponse.success(null, "Availability slot removed."));
    }

    @GetMapping("/provider/{providerId}/bookings")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getBookings(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long providerId
    ) {
        List<BookingDto> bookings = bookingService.getOfficerBookings(principal.getId(), providerId);
        return ResponseEntity.ok(ApiResponse.success(bookings, "Incoming bookings retrieved."));
    }

    @RequestMapping(value = "/bookings/{bookingId}/status", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<ApiResponse<BookingDto>> updateBookingStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> body
    ) {
        String statusStr = body.get("status");
        BookingStatus status = BookingStatus.valueOf(statusStr.toUpperCase());
        BookingDto updated = bookingService.updateBookingStatus(principal.getId(), bookingId, status);
        return ResponseEntity.ok(ApiResponse.success(updated, "Booking status updated to " + status + "."));
    }
}
