package com.nexora.repository;

import com.nexora.entity.Booking;
import com.nexora.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findByProviderProviderIdOrderByCreatedAtDesc(Long providerId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.provider.providerId = :providerId " +
           "AND b.bookingDate = :date AND b.startTime = :startTime " +
           "AND b.status IN ('PENDING', 'CONFIRMED')")
    long countOverlappingActiveBookings(
            @Param("providerId") Long providerId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime
    );

    long countByStatus(BookingStatus status);
}
