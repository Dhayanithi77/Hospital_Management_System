package com.hospital.hospitalManagement.repository;

import com.hospital.hospitalManagement.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    // Total stock quantity
    @Query("SELECT COALESCE(SUM(m.stockCount), 0) FROM Medicine m")
    Long getTotalStock();

    // Low stock medicines
    @Query("SELECT COUNT(m) FROM Medicine m WHERE m.stockCount < 500")
    Long getLowStockCount();

    // Medicines expiring within next 30 days
    @Query("""
           SELECT COUNT(m)
           FROM Medicine m
           WHERE m.expiry BETWEEN :today AND :endDate
           """)
    Long getExpiringSoonCount(@Param("today") LocalDate today, @Param("endDate") LocalDate endDate);
}