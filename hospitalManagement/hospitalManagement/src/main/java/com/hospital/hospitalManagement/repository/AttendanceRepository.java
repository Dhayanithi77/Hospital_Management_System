package com.hospital.hospitalManagement.repository;

import com.hospital.hospitalManagement.entity.Attendance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    List<Attendance> findByAttendanceDate(
            LocalDate attendanceDate
    );

    List<Attendance> findByDoctorNameContainingIgnoreCase(
            String doctorName
    );

    List<Attendance>
    findByAttendanceDateAndDoctorNameContainingIgnoreCase(
            LocalDate attendanceDate,
            String doctorName
    );

    boolean existsByDoctorIdAndAttendanceDate(
            Long doctorId,
            LocalDate attendanceDate
    );
}