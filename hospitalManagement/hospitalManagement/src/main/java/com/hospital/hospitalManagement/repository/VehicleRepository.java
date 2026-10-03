package com.hospital.hospitalManagement.repository;

import com.hospital.hospitalManagement.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
}
