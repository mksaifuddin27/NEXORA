package com.nexora.service;

import com.nexora.dto.ReportRequest;
import com.nexora.entity.Provider;
import com.nexora.entity.Rating;
import com.nexora.entity.Report;
import com.nexora.entity.User;
import com.nexora.exception.ResourceNotFoundException;
import com.nexora.repository.ProviderRepository;
import com.nexora.repository.RatingRepository;
import com.nexora.repository.ReportRepository;
import com.nexora.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final RatingRepository ratingRepository;

    public ReportService(
            ReportRepository reportRepository,
            UserRepository userRepository,
            ProviderRepository providerRepository,
            RatingRepository ratingRepository
    ) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.providerRepository = providerRepository;
        this.ratingRepository = ratingRepository;
    }

    @Transactional
    public Report createReport(Long reportingUserId, ReportRequest request) {
        User reportingUser = userRepository.findById(reportingUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Reporting user account not found."));

        Provider provider = null;
        if (request.getReportedProviderId() != null) {
            provider = providerRepository.findById(request.getReportedProviderId()).orElse(null);
        }

        Rating review = null;
        if (request.getReportedReviewId() != null) {
            review = ratingRepository.findById(request.getReportedReviewId()).orElse(null);
        }

        Report report = new Report(
                reportingUser,
                provider,
                review,
                request.getReason().trim()
        );

        return reportRepository.save(report);
    }
}
