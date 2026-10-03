package com.hospital.hospitalManagement.repository;

import com.hospital.hospitalManagement.entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShiftRepository
        extends JpaRepository<Shift, Long> {

    List<Shift> findByDay(String day);

    List<Shift> findByDoctorId(Long doctorId);

    boolean existsByDoctorIdAndDayAndType(Long doctorId, String day, String type);
}
