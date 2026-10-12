package com.nexora.service;

import com.nexora.dto.ProviderDto;
import com.nexora.entity.Provider;
import com.nexora.enums.VerificationStatus;
import com.nexora.exception.ResourceNotFoundException;
import com.nexora.repository.ProviderRepository;
import com.nexora.repository.RatingRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class ProviderService {

    private final ProviderRepository providerRepository;
    private final RatingRepository ratingRepository;

    public ProviderService(ProviderRepository providerRepository, RatingRepository ratingRepository) {
        this.providerRepository = providerRepository;
        this.ratingRepository = ratingRepository;
    }

    public List<ProviderDto> getPublicProviders(
            Long categoryId,
            String query,
            String viewMode,
            Double userLat,
            Double userLng,
            Double maxDistanceKm,
            Double minRating,
            String priceRange,
            String sortBy
    ) {
        List<Provider> providers = providerRepository.searchPublicProviders(
                VerificationStatus.VERIFIED,
                categoryId,
                (query != null && !query.trim().isEmpty()) ? query.trim() : null
        );

        List<ProviderDto> dtoList = new ArrayList<>();

        for (Provider p : providers) {
            Double distance = null;
            if (userLat != null && userLng != null && p.getLatitude() != null && p.getLongitude() != null) {
                distance = calculateHaversineKm(userLat, userLng, p.getLatitude(), p.getLongitude());
            }

            // Rating stats
            Double avgRating = 0.0;
            Long reviewCount = 0L;
            List<Object[]> summary = ratingRepository.getRatingSummary(p.getProviderId());
            if (!summary.isEmpty() && summary.get(0) != null) {
                Object[] row = summary.get(0);
                if (row[0] != null) avgRating = ((Number) row[0]).doubleValue();
                if (row[1] != null) reviewCount = ((Number) row[1]).longValue();
            }

            dtoList.add(ProviderDto.fromEntity(p, avgRating, reviewCount, distance));
        }

        // Filter: Price Range
        if (priceRange != null && !priceRange.equalsIgnoreCase("all")) {
            dtoList = dtoList.stream()
                    .filter(p -> priceRange.equals(p.getPriceRange()))
                    .toList();
        }

        // Filter: Minimum Rating
        if (minRating != null && minRating > 0) {
            dtoList = dtoList.stream()
                    .filter(p -> p.getRatingAvg() >= minRating)
                    .toList();
        }

        // Filter: Max Distance (only applicable when user coordinates provided)
        if (maxDistanceKm != null && maxDistanceKm > 0) {
            dtoList = dtoList.stream()
                    .filter(p -> p.getDistanceKm() != null && p.getDistanceKm() <= maxDistanceKm)
                    .toList();
        }

        // Modes and Ranking
        String mode = viewMode != null ? viewMode.toLowerCase() : "all";

        switch (mode) {
            case "nearby":
                // Strictly filter to those with real distance, sorted by nearest
                dtoList = dtoList.stream()
                        .filter(p -> p.getDistanceKm() != null)
                        .sorted(Comparator.comparingDouble(p -> p.getDistanceKm() != null ? p.getDistanceKm() : Double.MAX_VALUE))
                        .toList();
                break;

            case "best-nearby":
                // High rated & close, evaluated via Bayesian weighted score
                dtoList = dtoList.stream()
                        .filter(p -> p.getDistanceKm() != null && p.getRatingAvg() >= 4.4)
                        .sorted((a, b) -> {
                            double scoreA = calculateBayesianScore(a.getRatingAvg(), a.getReviewCount());
                            double scoreB = calculateBayesianScore(b.getRatingAvg(), b.getReviewCount());
                            if (Double.compare(scoreB, scoreA) != 0) {
                                return Double.compare(scoreB, scoreA);
                            }
                            return Double.compare(
                                    a.getDistanceKm() != null ? a.getDistanceKm() : 9999,
                                    b.getDistanceKm() != null ? b.getDistanceKm() : 9999
                            );
                        })
                        .toList();
                break;

            case "best-overall":
                // Bayesian weighted score across platform
                dtoList = dtoList.stream()
                        .filter(p -> p.getRatingAvg() >= 4.4)
                        .sorted((a, b) -> {
                            double scoreA = calculateBayesianScore(a.getRatingAvg(), a.getReviewCount());
                            double scoreB = calculateBayesianScore(b.getRatingAvg(), b.getReviewCount());
                            return Double.compare(scoreB, scoreA);
                        })
                        .toList();
                break;

            case "all":
            default:
                if ("distance".equalsIgnoreCase(sortBy)) {
                    dtoList = dtoList.stream()
                            .sorted(Comparator.comparing(
                                    p -> p.getDistanceKm() != null ? p.getDistanceKm() : Double.MAX_VALUE
                            ))
                            .toList();
                } else if ("rating".equalsIgnoreCase(sortBy)) {
                    dtoList = dtoList.stream()
                            .sorted((a, b) -> Double.compare(b.getRatingAvg(), a.getRatingAvg()))
                            .toList();
                } else if ("price-asc".equalsIgnoreCase(sortBy)) {
                    dtoList = dtoList.stream()
                            .sorted(Comparator.comparingInt(p -> p.getPriceRange() != null ? p.getPriceRange().length() : 0))
                            .toList();
                } else if ("price-desc".equalsIgnoreCase(sortBy)) {
                    dtoList = dtoList.stream()
                            .sorted((a, b) -> Integer.compare(
                                    b.getPriceRange() != null ? b.getPriceRange().length() : 0,
                                    a.getPriceRange() != null ? a.getPriceRange().length() : 0
                            ))
                            .toList();
                }
                break;
        }

        return dtoList;
    }

    public ProviderDto getProviderDetails(Long providerId, Double userLat, Double userLng) {
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + providerId));

        Double distance = null;
        if (userLat != null && userLng != null && provider.getLatitude() != null && provider.getLongitude() != null) {
            distance = calculateHaversineKm(userLat, userLng, provider.getLatitude(), provider.getLongitude());
        }

        Double avgRating = 0.0;
        Long reviewCount = 0L;
        List<Object[]> summary = ratingRepository.getRatingSummary(provider.getProviderId());
        if (!summary.isEmpty() && summary.get(0) != null) {
            Object[] row = summary.get(0);
            if (row[0] != null) avgRating = ((Number) row[0]).doubleValue();
            if (row[1] != null) reviewCount = ((Number) row[1]).longValue();
        }

        return ProviderDto.fromEntity(provider, avgRating, reviewCount, distance);
    }

    public List<ProviderDto> getFeaturedProviders(Double userLat, Double userLng) {
        List<ProviderDto> all = getPublicProviders(null, null, "best-overall", userLat, userLng, null, null, null, "rating");
        return all.stream().limit(4).toList();
    }

    /**
     * Mathematical Haversine great-circle distance algorithm in kilometers.
     */
    public static double calculateHaversineKm(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0; // Earth's radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round((R * c) * 10.0) / 10.0;
    }

    /**
     * Bayesian weighted score:
     * WR = (v / (v + m)) * R + (m / (v + m)) * C
     * where v = reviewCount, m = 3 (confidence threshold), C = 4.5 (baseline mean), R = avgRating
     */
    public static double calculateBayesianScore(double avgRating, long reviewCount) {
        final double m = 3.0;
        final double C = 4.5;
        double v = (double) reviewCount;
        return (v / (v + m)) * avgRating + (m / (v + m)) * C;
    }
}
