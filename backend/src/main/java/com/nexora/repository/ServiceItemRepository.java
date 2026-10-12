package com.nexora.repository;

import com.nexora.entity.ServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> {
    List<ServiceItem> findByProviderProviderIdAndActiveTrue(Long providerId);
    List<ServiceItem> findByProviderProviderId(Long providerId);
}
