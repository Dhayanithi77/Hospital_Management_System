package com.hospital.hospitalManagement.repository;

import com.hospital.hospitalManagement.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PayrollRepository
        extends JpaRepository<Payroll, Long> {

    List<Payroll> findByDoctorNameContainingIgnoreCase(String doctorName);
    long countByStatus(String status);
}
