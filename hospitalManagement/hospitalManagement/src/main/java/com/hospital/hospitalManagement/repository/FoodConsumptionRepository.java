package com.hospital.hospitalManagement.repository;

import com.hospital.hospitalManagement.entity.FoodConsumption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface FoodConsumptionRepository
        extends JpaRepository<FoodConsumption, Long> {

    Optional<FoodConsumption> findTopByOrderByDateDesc();

    Optional<FoodConsumption> findByDate(LocalDate date);
}