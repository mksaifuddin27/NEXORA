package com.nexora.controller;

import com.nexora.dto.ApiResponse;
import com.nexora.dto.AvailabilityDto;
import com.nexora.dto.ProviderDto;
import com.nexora.dto.ServiceDto;
import com.nexora.service.AvailabilityService;
import com.nexora.service.ProviderService;
import com.nexora.service.ServiceItemService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/providers")
public class ProviderController {

    private final ProviderService providerService;
    private final ServiceItemService serviceItemService;
    private final AvailabilityService availabilityService;

    public ProviderController(
            ProviderService providerService,
            ServiceItemService serviceItemService,
            AvailabilityService availabilityService
    ) {
        this.providerService = providerService;
        this.serviceItemService = serviceItemService;
        this.availabilityService = availabilityService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProviderDto>>> getProviders(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String q,
            @RequestParam(required = false, defaultValue = "all") String mode,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false) Double maxDistanceKm,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String priceRange,
            @RequestParam(required = false, defaultValue = "relevance") String sortBy
    ) {
        List<ProviderDto> list = providerService.getPublicProviders(
                categoryId, q, mode, lat, lng, maxDistanceKm, minRating, priceRange, sortBy
        );
        return ResponseEntity.ok(ApiResponse.success(list, "Providers retrieved."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProviderDto>> getProviderById(
            @PathVariable Long id,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng
    ) {
        ProviderDto provider = providerService.getProviderDetails(id, lat, lng);
        return ResponseEntity.ok(ApiResponse.success(provider, "Provider profile retrieved."));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ProviderDto>>> getFeaturedProviders(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng
    ) {
        List<ProviderDto> featured = providerService.getFeaturedProviders(lat, lng);
        return ResponseEntity.ok(ApiResponse.success(featured, "Featured providers retrieved."));
    }

    @GetMapping("/{id}/services")
    public ResponseEntity<ApiResponse<List<ServiceDto>>> getServicesByProvider(@PathVariable Long id) {
        List<ServiceDto> services = serviceItemService.getServicesByProviderId(id);
        return ResponseEntity.ok(ApiResponse.success(services, "Services retrieved."));
    }

    @GetMapping("/{id}/slots")
    public ResponseEntity<ApiResponse<List<AvailabilityDto>>> getSlotsByProvider(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<AvailabilityDto> slots = availabilityService.getSlotsByProvider(id, date);
        return ResponseEntity.ok(ApiResponse.success(slots, "Availability slots retrieved."));
    }
}
