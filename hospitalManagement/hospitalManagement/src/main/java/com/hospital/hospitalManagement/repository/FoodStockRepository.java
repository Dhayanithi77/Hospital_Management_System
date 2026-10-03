package com.hospital.hospitalManagement.repository;

import com.hospital.hospitalManagement.entity.FoodStock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodStockRepository extends JpaRepository<FoodStock, Long> {
}