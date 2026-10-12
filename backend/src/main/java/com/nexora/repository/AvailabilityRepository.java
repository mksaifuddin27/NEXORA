package com.nexora.repository;

import com.nexora.entity.Availability;
import com.nexora.enums.SlotStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {

    List<Availability> findByProviderProviderId(Long providerId);

    List<Availability> findByProviderProviderIdAndAvailableDate(Long providerId, LocalDate date);

    List<Availability> findByProviderProviderIdAndStatus(Long providerId, SlotStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Availability a WHERE a.availabilityId = :id")
    Optional<Availability> findByIdWithLock(@Param("id") Long id);
}
