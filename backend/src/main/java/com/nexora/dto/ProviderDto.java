package com.nexora.dto;

import com.nexora.entity.Provider;
import com.nexora.enums.VerificationStatus;
import java.time.LocalDateTime;

public class ProviderDto {

    private Long providerId;
    private Long officerId;
    private String officerName;
    private Long categoryId;
    private String categoryName;
    private String providerName;
    private String description;
    private String phone;
    private String email;
    private String address;
    private String city;
    private Double latitude;
    private Double longitude;
    private String openingHours;
    private VerificationStatus verificationStatus;
    private boolean bookingSupported;
    private boolean active;
    private String imageUrl;
    private String priceRange;
    private Double ratingAvg = 0.0;
    private Long reviewCount = 0L;
    private Double distanceKm;
    private LocalDateTime createdAt;

    public ProviderDto() {
    }

    public static ProviderDto fromEntity(Provider provider, Double ratingAvg, Long reviewCount, Double distanceKm) {
        if (provider == null) return null;
        ProviderDto dto = new ProviderDto();
        dto.setProviderId(provider.getProviderId());
        if (provider.getOfficer() != null) {
            dto.setOfficerId(provider.getOfficer().getUserId());
            dto.setOfficerName(provider.getOfficer().getFullName());
        }
        if (provider.getCategory() != null) {
            dto.setCategoryId(provider.getCategory().getCategoryId());
            dto.setCategoryName(provider.getCategory().getCategoryName());
        }
        dto.setProviderName(provider.getProviderName());
        dto.setDescription(provider.getDescription());
        dto.setPhone(provider.getPhone());
        dto.setEmail(provider.getEmail());
        dto.setAddress(provider.getAddress());
        dto.setCity(provider.getCity());
        dto.setLatitude(provider.getLatitude());
        dto.setLongitude(provider.getLongitude());
        dto.setOpeningHours(provider.getOpeningHours());
        dto.setVerificationStatus(provider.getVerificationStatus());
        dto.setBookingSupported(provider.isBookingSupported());
        dto.setActive(provider.isActive());
        dto.setImageUrl(provider.getImageUrl());
        dto.setPriceRange(provider.getPriceRange());
        dto.setCreatedAt(provider.getCreatedAt());

        dto.setRatingAvg(ratingAvg != null ? Math.round(ratingAvg * 10.0) / 10.0 : 0.0);
        dto.setReviewCount(reviewCount != null ? reviewCount : 0L);
        dto.setDistanceKm(distanceKm != null ? Math.round(distanceKm * 10.0) / 10.0 : null);
        return dto;
    }

    // Getters and Setters
    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }
    public Long getOfficerId() { return officerId; }
    public void setOfficerId(Long officerId) { this.officerId = officerId; }
    public String getOfficerName() { return officerName; }
    public void setOfficerName(String officerName) { this.officerName = officerName; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getOpeningHours() { return openingHours; }
    public void setOpeningHours(String openingHours) { this.openingHours = openingHours; }
    public VerificationStatus getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }
    public boolean isBookingSupported() { return bookingSupported; }
    public void setBookingSupported(boolean bookingSupported) { this.bookingSupported = bookingSupported; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getPriceRange() { return priceRange; }
    public void setPriceRange(String priceRange) { this.priceRange = priceRange; }
    public Double getRatingAvg() { return ratingAvg; }
    public void setRatingAvg(Double ratingAvg) { this.ratingAvg = ratingAvg; }
    public Long getReviewCount() { return reviewCount; }
    public void setReviewCount(Long reviewCount) { this.reviewCount = reviewCount; }
    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
