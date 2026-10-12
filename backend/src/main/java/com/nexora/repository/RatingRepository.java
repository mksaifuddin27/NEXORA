package com.nexora.repository;

import com.nexora.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByProviderProviderIdOrderByCreatedAtDesc(Long providerId);

    List<Rating> findByUserUserIdOrderByCreatedAtDesc(Long userId);

    List<Rating> findAllByOrderByCreatedAtDesc();

    boolean existsByBookingBookingId(Long bookingId);

    @Query("SELECT COALESCE(AVG(r.ratingScore), 0.0), COUNT(r) FROM Rating r WHERE r.provider.providerId = :providerId")
    List<Object[]> getRatingSummary(@Param("providerId") Long providerId);
}
