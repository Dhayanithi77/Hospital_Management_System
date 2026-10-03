package com.hospital.hospitalManagement.repository;

import com.hospital.hospitalManagement.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorRepository
        extends JpaRepository<Doctor, Long> {

    List<Doctor> findByDepartment(String department);

    List<Doctor> findByNameContainingIgnoreCaseOrDepartmentContainingIgnoreCase(String name, String department);
}
