package com.nexora.dto;

import com.nexora.entity.Booking;
import com.nexora.enums.BookingStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class BookingDto {

    private Long bookingId;
    private Long userId;
    private String userName;
    private Long providerId;
    private String providerName;
    private Long categoryId;
    private String categoryName;
    private String providerAddress;
    private String providerPhone;
    private Long serviceId;
    private String serviceName;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private BookingStatus status;
    private BigDecimal totalPrice;
    private String notes;
    private LocalDateTime createdAt;

    public BookingDto() {
    }

    public static BookingDto fromEntity(Booking b) {
        if (b == null) return null;
        BookingDto dto = new BookingDto();
        dto.setBookingId(b.getBookingId());
        if (b.getUser() != null) {
            dto.setUserId(b.getUser().getUserId());
            dto.setUserName(b.getUser().getFullName());
        }
        if (b.getProvider() != null) {
            dto.setProviderId(b.getProvider().getProviderId());
            dto.setProviderName(b.getProvider().getProviderName());
            dto.setProviderAddress(b.getProvider().getAddress());
            dto.setProviderPhone(b.getProvider().getPhone());
            if (b.getProvider().getCategory() != null) {
                dto.setCategoryId(b.getProvider().getCategory().getCategoryId());
                dto.setCategoryName(b.getProvider().getCategory().getCategoryName());
            }
        }
        if (b.getService() != null) {
            dto.setServiceId(b.getService().getServiceId());
            dto.setServiceName(b.getService().getServiceName());
        }
        dto.setBookingDate(b.getBookingDate());
        dto.setBookingTime(b.getStartTime());
        dto.setStatus(b.getStatus());
        dto.setTotalPrice(b.getTotalPrice());
        dto.setNotes(b.getNotes());
        dto.setCreatedAt(b.getCreatedAt());
        return dto;
    }

    // Getters and Setters
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }
    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public String getProviderAddress() { return providerAddress; }
    public void setProviderAddress(String providerAddress) { this.providerAddress = providerAddress; }
    public String getProviderPhone() { return providerPhone; }
    public void setProviderPhone(String providerPhone) { this.providerPhone = providerPhone; }
    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }
    public LocalTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalTime bookingTime) { this.bookingTime = bookingTime; }
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
