package com.nexora.service;

import com.nexora.dto.ProviderDto;
import com.nexora.dto.ProviderRequest;
import com.nexora.entity.Category;
import com.nexora.entity.Provider;
import com.nexora.entity.User;
import com.nexora.enums.VerificationStatus;
import com.nexora.exception.ForbiddenException;
import com.nexora.exception.ResourceNotFoundException;
import com.nexora.repository.CategoryRepository;
import com.nexora.repository.ProviderRepository;
import com.nexora.repository.RatingRepository;
import com.nexora.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OfficerService {

    private final ProviderRepository providerRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;

    public OfficerService(
            ProviderRepository providerRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            RatingRepository ratingRepository
    ) {
        this.providerRepository = providerRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.ratingRepository = ratingRepository;
    }

    public ProviderDto getOfficerProvider(Long officerUserId) {
        Provider provider = providerRepository.findFirstByOfficerUserId(officerUserId)
                .orElse(null);

        if (provider == null) return null;

        Double avgRating = 0.0;
        Long reviewCount = 0L;
        List<Object[]> summary = ratingRepository.getRatingSummary(provider.getProviderId());
        if (!summary.isEmpty() && summary.get(0) != null) {
            Object[] row = summary.get(0);
            if (row[0] != null) avgRating = ((Number) row[0]).doubleValue();
            if (row[1] != null) reviewCount = ((Number) row[1]).longValue();
        }

        return ProviderDto.fromEntity(provider, avgRating, reviewCount, null);
    }

    @Transactional
    public ProviderDto updateProviderProfile(Long officerUserId, Long providerId, ProviderRequest request) {
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + providerId));

        if (!provider.getOfficer().getUserId().equals(officerUserId)) {
            throw new ForbiddenException("Unauthorized: You do not own or manage this provider profile.");
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));
            provider.setCategory(category);
        }

        provider.setProviderName(request.getProviderName().trim());
        provider.setDescription(request.getDescription());
        provider.setPhone(request.getPhone());
        provider.setEmail(request.getEmail());
        provider.setAddress(request.getAddress().trim());
        provider.setCity(request.getCity());
        provider.setOpeningHours(request.getOpeningHours());
        if (request.getLatitude() != null) provider.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) provider.setLongitude(request.getLongitude());
        if (request.getImageUrl() != null) provider.setImageUrl(request.getImageUrl());
        if (request.getPriceRange() != null) provider.setPriceRange(request.getPriceRange());
        if (request.getBookingSupported() != null) provider.setBookingSupported(request.getBookingSupported());

        Provider saved = providerRepository.save(provider);
        return ProviderDto.fromEntity(saved, 0.0, 0L, null);
    }

    @Transactional
    public ProviderDto createProviderForOfficer(Long officerUserId, ProviderRequest request) {
        User officer = userRepository.findById(officerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Officer account not found."));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        Provider provider = new Provider();
        provider.setOfficer(officer);
        provider.setCategory(category);
        provider.setProviderName(request.getProviderName().trim());
        provider.setDescription(request.getDescription());
        provider.setPhone(request.getPhone());
        provider.setEmail(request.getEmail());
        provider.setAddress(request.getAddress().trim());
        provider.setCity(request.getCity());
        provider.setLatitude(request.getLatitude());
        provider.setLongitude(request.getLongitude());
        provider.setOpeningHours(request.getOpeningHours());
        provider.setImageUrl(request.getImageUrl());
        provider.setPriceRange(request.getPriceRange() != null ? request.getPriceRange() : "$$");
        provider.setBookingSupported(request.getBookingSupported() != null ? request.getBookingSupported() : true);
        provider.setVerificationStatus(VerificationStatus.PENDING);
        provider.setActive(true);

        Provider saved = providerRepository.save(provider);
        return ProviderDto.fromEntity(saved, 0.0, 0L, null);
    }
}
