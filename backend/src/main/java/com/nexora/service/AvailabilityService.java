package com.nexora.service;

import com.nexora.dto.AvailabilityDto;
import com.nexora.dto.AvailabilityRequest;
import com.nexora.entity.Availability;
import com.nexora.entity.Provider;
import com.nexora.exception.ForbiddenException;
import com.nexora.exception.ResourceNotFoundException;
import com.nexora.repository.AvailabilityRepository;
import com.nexora.repository.ProviderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class AvailabilityService {

    private final AvailabilityRepository availabilityRepository;
    private final ProviderRepository providerRepository;

    public AvailabilityService(AvailabilityRepository availabilityRepository, ProviderRepository providerRepository) {
        this.availabilityRepository = availabilityRepository;
        this.providerRepository = providerRepository;
    }

    public List<AvailabilityDto> getSlotsByProvider(Long providerId, LocalDate date) {
        List<Availability> slots;
        if (date != null) {
            slots = availabilityRepository.findByProviderProviderIdAndAvailableDate(providerId, date);
        } else {
            slots = availabilityRepository.findByProviderProviderId(providerId);
        }
        return slots.stream().map(AvailabilityDto::fromEntity).toList();
    }

    @Transactional
    public AvailabilityDto createSlot(Long officerUserId, Long providerId, AvailabilityRequest request) {
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + providerId));

        if (!provider.getOfficer().getUserId().equals(officerUserId)) {
            throw new ForbiddenException("Unauthorized: You do not own or manage this provider calendar.");
        }

        Availability slot = new Availability(
                provider,
                request.getAvailableDate(),
                request.getStartTime(),
                request.getEndTime(),
                request.getStatus(),
                request.getCapacity()
        );

        return AvailabilityDto.fromEntity(availabilityRepository.save(slot));
    }

    @Transactional
    public void deleteSlot(Long officerUserId, Long slotId) {
        Availability slot = availabilityRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found with ID: " + slotId));

        if (!slot.getProvider().getOfficer().getUserId().equals(officerUserId)) {
            throw new ForbiddenException("Unauthorized: You do not own or manage this provider slot.");
        }

        availabilityRepository.delete(slot);
    }
}
