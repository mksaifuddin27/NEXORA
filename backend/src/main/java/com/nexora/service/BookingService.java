package com.nexora.service;

import com.nexora.dto.BookingDto;
import com.nexora.dto.BookingRequest;
import com.nexora.entity.*;
import com.nexora.enums.BookingStatus;
import com.nexora.enums.SlotStatus;
import com.nexora.enums.VerificationStatus;
import com.nexora.exception.BadRequestException;
import com.nexora.exception.ForbiddenException;
import com.nexora.exception.ResourceNotFoundException;
import com.nexora.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ProviderRepository providerRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final AvailabilityRepository availabilityRepository;
    private final UserRepository userRepository;

    public BookingService(
            BookingRepository bookingRepository,
            ProviderRepository providerRepository,
            ServiceItemRepository serviceItemRepository,
            AvailabilityRepository availabilityRepository,
            UserRepository userRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.providerRepository = providerRepository;
        this.serviceItemRepository = serviceItemRepository;
        this.availabilityRepository = availabilityRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingDto createBooking(Long customerUserId, BookingRequest request) {
        User customer = userRepository.findById(customerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer account not found."));

        Provider provider = providerRepository.findById(request.getProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + request.getProviderId()));

        if (!provider.isActive() || provider.getVerificationStatus() != VerificationStatus.VERIFIED) {
            throw new BadRequestException("This establishment is currently not active or unverified for public reservations.");
        }

        if (!provider.isBookingSupported()) {
            throw new BadRequestException("This provider does not currently accept direct online reservations.");
        }

        ServiceItem serviceItem = serviceItemRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service offering not found with ID: " + request.getServiceId()));

        if (!serviceItem.getProvider().getProviderId().equals(provider.getProviderId())) {
            throw new BadRequestException("The requested service does not belong to this provider.");
        }

        if (!serviceItem.isActive()) {
            throw new BadRequestException("The requested service is no longer offered.");
        }

        // Server-Side Concurrency & Availability Re-check
        if (request.getSlotId() != null) {
            Availability slot = availabilityRepository.findByIdWithLock(request.getSlotId())
                    .orElseThrow(() -> new ResourceNotFoundException("Selected schedule slot does not exist."));

            if (slot.getStatus() != SlotStatus.AVAILABLE) {
                throw new BadRequestException("The selected slot is already booked or unavailable. Please choose another slot.");
            }

            // Atomically update slot status
            slot.setStatus(SlotStatus.BOOKED);
            availabilityRepository.save(slot);
        } else {
            long existingActive = bookingRepository.countOverlappingActiveBookings(
                    provider.getProviderId(),
                    request.getBookingDate(),
                    request.getStartTime()
            );

            if (existingActive > 0) {
                throw new BadRequestException("This time window has already been reserved. Please pick another time.");
            }
        }

        Booking booking = new Booking(
                customer,
                provider,
                serviceItem,
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime(),
                serviceItem.getPrice(),
                request.getNotes()
        );

        Booking savedBooking = bookingRepository.save(booking);
        return BookingDto.fromEntity(savedBooking);
    }

    public List<BookingDto> getUserBookings(Long userId) {
        return bookingRepository.findByUserUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(BookingDto::fromEntity)
                .toList();
    }

    public List<BookingDto> getOfficerBookings(Long officerUserId, Long providerId) {
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + providerId));

        if (!provider.getOfficer().getUserId().equals(officerUserId)) {
            throw new ForbiddenException("Unauthorized: You do not have permissions to access bookings for this provider.");
        }

        return bookingRepository.findByProviderProviderIdOrderByCreatedAtDesc(providerId)
                .stream()
                .map(BookingDto::fromEntity)
                .toList();
    }

    public List<BookingDto> getAllBookingsForAdmin() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(BookingDto::fromEntity)
                .toList();
    }

    @Transactional
    public BookingDto updateBookingStatus(Long officerUserId, Long bookingId, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking record not found with ID: " + bookingId));

        if (!booking.getProvider().getOfficer().getUserId().equals(officerUserId)) {
            throw new ForbiddenException("Unauthorized: You do not manage the establishment associated with this booking.");
        }

        // Validate state transitions
        BookingStatus current = booking.getStatus();
        if (current == BookingStatus.COMPLETED || current == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cannot update status of a " + current + " booking.");
        }

        booking.setStatus(newStatus);
        return BookingDto.fromEntity(bookingRepository.save(booking));
    }

    @Transactional
    public BookingDto cancelBookingByUser(Long customerUserId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (!booking.getUser().getUserId().equals(customerUserId)) {
            throw new ForbiddenException("Unauthorized: You can only cancel your own bookings.");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Completed bookings cannot be cancelled.");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return BookingDto.fromEntity(bookingRepository.save(booking));
    }
}
