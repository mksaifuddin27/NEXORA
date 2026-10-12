package com.nexora.dto;

public class SystemStatsDto {

    private long totalUsers;
    private long totalProviders;
    private long totalBookings;
    private long pendingVerifications;
    private long totalReviews;

    public SystemStatsDto() {
    }

    public SystemStatsDto(long totalUsers, long totalProviders, long totalBookings, long pendingVerifications, long totalReviews) {
        this.totalUsers = totalUsers;
        this.totalProviders = totalProviders;
        this.totalBookings = totalBookings;
        this.pendingVerifications = pendingVerifications;
        this.totalReviews = totalReviews;
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public long getTotalProviders() { return totalProviders; }
    public void setTotalProviders(long totalProviders) { this.totalProviders = totalProviders; }
    public long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(long totalBookings) { this.totalBookings = totalBookings; }
    public long getPendingVerifications() { return pendingVerifications; }
    public void setPendingVerifications(long pendingVerifications) { this.pendingVerifications = pendingVerifications; }
    public long getTotalReviews() { return totalReviews; }
    public void setTotalReviews(long totalReviews) { this.totalReviews = totalReviews; }
}
