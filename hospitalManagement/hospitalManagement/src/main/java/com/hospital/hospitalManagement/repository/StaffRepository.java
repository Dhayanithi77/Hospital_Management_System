package com.hospital.hospitalManagement.repository;

import com.hospital.hospitalManagement.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StaffRepository extends JpaRepository<Staff, Long> {

    List<Staff> findByDepartment(String department);

    List<Staff> findByAssignedTo(Long assignedTo);
}