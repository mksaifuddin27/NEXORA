package com.nexora.dto;

import com.nexora.entity.ServiceItem;
import java.math.BigDecimal;

public class ServiceDto {

    private Long serviceId;
    private Long providerId;
    private String serviceName;
    private String description;
    private BigDecimal price;
    private Integer durationMins;
    private boolean active;

    public ServiceDto() {
    }

    public static ServiceDto fromEntity(ServiceItem item) {
        if (item == null) return null;
        ServiceDto dto = new ServiceDto();
        dto.setServiceId(item.getServiceId());
        if (item.getProvider() != null) {
            dto.setProviderId(item.getProvider().getProviderId());
        }
        dto.setServiceName(item.getServiceName());
        dto.setDescription(item.getDescription());
        dto.setPrice(item.getPrice());
        dto.setDurationMins(item.getDurationMins());
        dto.setActive(item.isActive());
        return dto;
    }

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getDurationMins() { return durationMins; }
    public void setDurationMins(Integer durationMins) { this.durationMins = durationMins; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
