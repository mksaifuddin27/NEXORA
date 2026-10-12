package com.nexora.repository;

import com.nexora.entity.Provider;
import com.nexora.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {

    List<Provider> findByOfficerUserId(Long officerId);

    Optional<Provider> findFirstByOfficerUserId(Long officerId);

    List<Provider> findByVerificationStatusAndActiveTrue(VerificationStatus status);

    List<Provider> findByCategoryCategoryIdAndVerificationStatusAndActiveTrue(Long categoryId, VerificationStatus status);

    @Query("SELECT p FROM Provider p WHERE p.active = true AND p.verificationStatus = :status AND " +
           "(:categoryId IS NULL OR p.category.categoryId = :categoryId) AND " +
           "(:query IS NULL OR LOWER(p.providerName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(p.address) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(p.city) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Provider> searchPublicProviders(
            @Param("status") VerificationStatus status,
            @Param("categoryId") Long categoryId,
            @Param("query") String query
    );

    long countByVerificationStatus(VerificationStatus status);
}
