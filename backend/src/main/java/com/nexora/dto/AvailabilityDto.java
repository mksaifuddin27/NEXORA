package com.nexora.dto;

import com.nexora.entity.Availability;
import com.nexora.enums.SlotStatus;
import java.time.LocalDate;
import java.time.LocalTime;

public class AvailabilityDto {

    private Long availabilityId;
    private Long providerId;
    private LocalDate availableDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private SlotStatus status;
    private int capacity;

    public AvailabilityDto() {
    }

    public static AvailabilityDto fromEntity(Availability slot) {
        if (slot == null) return null;
        AvailabilityDto dto = new AvailabilityDto();
        dto.setAvailabilityId(slot.getAvailabilityId());
        if (slot.getProvider() != null) {
            dto.setProviderId(slot.getProvider().getProviderId());
        }
        dto.setAvailableDate(slot.getAvailableDate());
        dto.setStartTime(slot.getStartTime());
        dto.setEndTime(slot.getEndTime());
        dto.setStatus(slot.getStatus());
        dto.setCapacity(slot.getCapacity());
        return dto;
    }

    public Long getAvailabilityId() { return availabilityId; }
    public void setAvailabilityId(Long availabilityId) { this.availabilityId = availabilityId; }
    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }
    public LocalDate getAvailableDate() { return availableDate; }
    public void setAvailableDate(LocalDate availableDate) { this.availableDate = availableDate; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public SlotStatus getStatus() { return status; }
    public void setStatus(SlotStatus status) { this.status = status; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
}
