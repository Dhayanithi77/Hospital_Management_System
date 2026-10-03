package com.hospital.hospitalManagement.repository;

import com.hospital.hospitalManagement.entity.EssentialNeeds;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EssentialNeedsRepository
        extends JpaRepository<EssentialNeeds, Long> {
}