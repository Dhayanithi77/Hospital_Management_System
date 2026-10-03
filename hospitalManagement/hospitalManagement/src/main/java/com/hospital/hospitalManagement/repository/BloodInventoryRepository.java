package com.hospital.hospitalManagement.repository;

import com.hospital.hospitalManagement.entity.BloodInventory;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BloodInventoryRepository
        extends JpaRepository<BloodInventory, Long> {

    Optional<BloodInventory> findByBloodType(String bloodType);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM BloodInventory b WHERE b.bloodType = :bloodType")
    Optional<BloodInventory> findByBloodTypeForUpdate(@Param("bloodType") String bloodType);
}