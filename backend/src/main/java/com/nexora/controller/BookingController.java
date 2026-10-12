package com.nexora.controller;

import com.nexora.dto.ApiResponse;
import com.nexora.dto.BookingDto;
import com.nexora.dto.BookingRequest;
import com.nexora.security.UserPrincipal;
import com.nexora.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingDto>> createBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody BookingRequest request
    ) {
        BookingDto booking = bookingService.createBooking(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(booking, "Booking reservation confirmed successfully."));
    }

    @GetMapping({"/my", "/my-bookings"})
    public ResponseEntity<ApiResponse<List<BookingDto>>> getMyBookings(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<BookingDto> myBookings = bookingService.getUserBookings(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(myBookings, "User bookings retrieved."));
    }

    @RequestMapping(value = "/{id}/cancel", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<ApiResponse<BookingDto>> cancelBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id
    ) {
        BookingDto cancelled = bookingService.cancelBookingByUser(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(cancelled, "Booking reservation cancelled successfully."));
    }
}
