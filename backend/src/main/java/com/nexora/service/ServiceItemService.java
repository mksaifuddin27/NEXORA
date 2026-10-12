package com.nexora.service;

import com.nexora.dto.ServiceDto;
import com.nexora.dto.ServiceRequest;
import com.nexora.entity.Provider;
import com.nexora.entity.ServiceItem;
import com.nexora.exception.ForbiddenException;
import com.nexora.exception.ResourceNotFoundException;
import com.nexora.repository.ProviderRepository;
import com.nexora.repository.ServiceItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ServiceItemService {

    private final ServiceItemRepository serviceItemRepository;
    private final ProviderRepository providerRepository;

    public ServiceItemService(ServiceItemRepository serviceItemRepository, ProviderRepository providerRepository) {
        this.serviceItemRepository = serviceItemRepository;
        this.providerRepository = providerRepository;
    }

    public List<ServiceDto> getServicesByProviderId(Long providerId) {
        return serviceItemRepository.findByProviderProviderIdAndActiveTrue(providerId)
                .stream()
                .map(ServiceDto::fromEntity)
                .toList();
    }

    @Transactional
    public ServiceDto createService(Long officerUserId, Long providerId, ServiceRequest request) {
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + providerId));

        if (!provider.getOfficer().getUserId().equals(officerUserId)) {
            throw new ForbiddenException("Unauthorized: You do not own or manage this provider establishment.");
        }

        ServiceItem item = new ServiceItem(
                provider,
                request.getServiceName().trim(),
                request.getDescription(),
                request.getPrice(),
                request.getDurationMins()
        );

        return ServiceDto.fromEntity(serviceItemRepository.save(item));
    }

    @Transactional
    public ServiceDto updateService(Long officerUserId, Long serviceId, ServiceRequest request) {
        ServiceItem item = serviceItemRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service item not found with ID: " + serviceId));

        if (!item.getProvider().getOfficer().getUserId().equals(officerUserId)) {
            throw new ForbiddenException("Unauthorized: You do not own or manage this service offering.");
        }

        item.setServiceName(request.getServiceName().trim());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setDurationMins(request.getDurationMins());

        return ServiceDto.fromEntity(serviceItemRepository.save(item));
    }

    @Transactional
    public void deleteService(Long officerUserId, Long serviceId) {
        ServiceItem item = serviceItemRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service item not found with ID: " + serviceId));

        if (!item.getProvider().getOfficer().getUserId().equals(officerUserId)) {
            throw new ForbiddenException("Unauthorized: You do not own or manage this service offering.");
        }

        item.setActive(false);
        serviceItemRepository.save(item);
    }
}
