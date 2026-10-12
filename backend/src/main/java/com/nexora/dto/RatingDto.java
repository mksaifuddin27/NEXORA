package com.nexora.dto;

import com.nexora.entity.Rating;
import java.time.LocalDateTime;

public class RatingDto {

    private Long ratingId;
    private Long userId;
    private String userName;
    private Long providerId;
    private Long bookingId;
    private int rating;
    private String review;
    private LocalDateTime createdAt;

    public RatingDto() {
    }

    public static RatingDto fromEntity(Rating r) {
        if (r == null) return null;
        RatingDto dto = new RatingDto();
        dto.setRatingId(r.getRatingId());
        if (r.getUser() != null) {
            dto.setUserId(r.getUser().getUserId());
            dto.setUserName(r.getUser().getFullName());
        }
        if (r.getProvider() != null) {
            dto.setProviderId(r.getProvider().getProviderId());
        }
        if (r.getBooking() != null) {
            dto.setBookingId(r.getBooking().getBookingId());
        }
        dto.setRating(r.getRatingScore());
        dto.setReview(r.getReviewText());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }

    public Long getRatingId() { return ratingId; }
    public void setRatingId(Long ratingId) { this.ratingId = ratingId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getReview() { return review; }
    public void setReview(String review) { this.review = review; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
