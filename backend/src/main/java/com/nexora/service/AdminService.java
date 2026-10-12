package com.nexora.service;

import com.nexora.dto.ProviderDto;
import com.nexora.dto.SystemStatsDto;
import com.nexora.dto.UserDto;
import com.nexora.entity.Provider;
import com.nexora.entity.Report;
import com.nexora.entity.User;
import com.nexora.enums.ReportStatus;
import com.nexora.enums.VerificationStatus;
import com.nexora.exception.ResourceNotFoundException;
import com.nexora.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final BookingRepository bookingRepository;
    private final RatingRepository ratingRepository;
    private final ReportRepository reportRepository;

    public AdminService(
            UserRepository userRepository,
            ProviderRepository providerRepository,
            BookingRepository bookingRepository,
            RatingRepository ratingRepository,
            ReportRepository reportRepository
    ) {
        this.userRepository = userRepository;
        this.providerRepository = providerRepository;
        this.bookingRepository = bookingRepository;
        this.ratingRepository = ratingRepository;
        this.reportRepository = reportRepository;
    }

    public SystemStatsDto getSystemStats() {
        long users = userRepository.count();
        long providers = providerRepository.count();
        long bookings = bookingRepository.count();
        long pending = providerRepository.countByVerificationStatus(VerificationStatus.PENDING);
        long reviews = ratingRepository.count();

        return new SystemStatsDto(users, providers, bookings, pending, reviews);
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .toList();
    }

    @Transactional
    public UserDto updateUserStatus(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        user.setEnabled(enabled);
        return UserDto.fromEntity(userRepository.save(user));
    }

    public List<ProviderDto> getAllProviders() {
        return providerRepository.findAll().stream()
                .map(p -> {
                    Double avgRating = 0.0;
                    Long reviewCount = 0L;
                    List<Object[]> summary = ratingRepository.getRatingSummary(p.getProviderId());
                    if (!summary.isEmpty() && summary.get(0) != null) {
                        Object[] row = summary.get(0);
                        if (row[0] != null) avgRating = ((Number) row[0]).doubleValue();
                        if (row[1] != null) reviewCount = ((Number) row[1]).longValue();
                    }
                    return ProviderDto.fromEntity(p, avgRating, reviewCount, null);
                })
                .toList();
    }

    @Transactional
    public ProviderDto updateProviderVerification(Long providerId, VerificationStatus status) {
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + providerId));

        provider.setVerificationStatus(status);
        Provider saved = providerRepository.save(provider);
        return ProviderDto.fromEntity(saved, 0.0, 0L, null);
    }

    public List<Report> getAllReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Report resolveReport(Long reportId, ReportStatus status) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with ID: " + reportId));
        report.setStatus(status);
        return reportRepository.save(report);
    }
}
