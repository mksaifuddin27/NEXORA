package com.nexora.service;

import com.nexora.dto.RatingDto;
import com.nexora.dto.RatingRequest;
import com.nexora.entity.Booking;
import com.nexora.entity.Provider;
import com.nexora.entity.Rating;
import com.nexora.entity.User;
import com.nexora.exception.BadRequestException;
import com.nexora.exception.DuplicateResourceException;
import com.nexora.exception.ResourceNotFoundException;
import com.nexora.repository.BookingRepository;
import com.nexora.repository.ProviderRepository;
import com.nexora.repository.RatingRepository;
import com.nexora.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final ProviderRepository providerRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public RatingService(
            RatingRepository ratingRepository,
            ProviderRepository providerRepository,
            BookingRepository bookingRepository,
            UserRepository userRepository
    ) {
        this.ratingRepository = ratingRepository;
        this.providerRepository = providerRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    public List<RatingDto> getRatingsByProviderId(Long providerId) {
        return ratingRepository.findByProviderProviderIdOrderByCreatedAtDesc(providerId)
                .stream()
                .map(RatingDto::fromEntity)
                .toList();
    }

    public List<RatingDto> getAllRatingsForAdmin() {
        return ratingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(RatingDto::fromEntity)
                .toList();
    }

    @Transactional
    public RatingDto submitRating(Long customerUserId, RatingRequest request) {
        User customer = userRepository.findById(customerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer account not found."));

        Provider provider = providerRepository.findById(request.getProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + request.getProviderId()));

        Booking booking = null;
        if (request.getBookingId() != null) {
            booking = bookingRepository.findById(request.getBookingId())
                    .orElseThrow(() -> new ResourceNotFoundException("Booking record not found with ID: " + request.getBookingId()));

            if (!booking.getUser().getUserId().equals(customerUserId)) {
                throw new BadRequestException("You can only review bookings made from your own account.");
            }

            // Enforce one-review-per-booking rule
            if (ratingRepository.existsByBookingBookingId(request.getBookingId())) {
                throw new DuplicateResourceException("You have already submitted a review for this booking reservation.");
            }
        }

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new BadRequestException("Rating score must be between 1 and 5 stars.");
        }

        Rating rating = new Rating(
                customer,
                provider,
                booking,
                request.getRating(),
                request.getReview().trim()
        );

        return RatingDto.fromEntity(ratingRepository.save(rating));
    }

    @Transactional
    public void deleteRatingByAdmin(Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found with ID: " + ratingId));
        ratingRepository.delete(rating);
    }
}
