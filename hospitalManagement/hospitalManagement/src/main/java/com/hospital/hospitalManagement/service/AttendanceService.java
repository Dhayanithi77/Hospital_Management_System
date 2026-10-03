package com.hospital.hospitalManagement.service;

import com.hospital.hospitalManagement.dto.AttendanceRequest;
import com.hospital.hospitalManagement.entity.Attendance;
import com.hospital.hospitalManagement.repository.AttendanceRepository;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository) {

        this.attendanceRepository = attendanceRepository;
    }


    // ==================================================
    // GET ALL ATTENDANCE
    // ==================================================

    public List<Attendance> getAllAttendance() {

        return attendanceRepository.findAll();
    }


    // ==================================================
    // GET BY DATE
    // ==================================================

    public List<Attendance> getByDate(
            LocalDate date) {

        return attendanceRepository
                .findByAttendanceDate(date);
    }


    // ==================================================
    // SEARCH
    // ==================================================

    public List<Attendance> search(
            String name) {

        return attendanceRepository
                .findByDoctorNameContainingIgnoreCase(
                        name
                );
    }


    // ==================================================
    // SEARCH BY DATE + NAME
    // ==================================================

    public List<Attendance> searchByDate(
            String name,
            LocalDate date) {

        return attendanceRepository
                .findByAttendanceDateAndDoctorNameContainingIgnoreCase(
                        date,
                        name
                );
    }


    // ==================================================
    // MARK ATTENDANCE
    // ==================================================

    public Attendance markAttendance(
            AttendanceRequest request) {


        // ----------------------------------------------
        // VALIDATION
        // ----------------------------------------------

        if (request.getDoctorId() == null) {

            throw new RuntimeException(
                    "Doctor ID is required"
            );
        }


        if (request.getDoctorName() == null ||
                request.getDoctorName().isBlank()) {

            throw new RuntimeException(
                    "Doctor name is required"
            );
        }


        if (request.getAttendanceDate() == null) {

            throw new RuntimeException(
                    "Attendance date is required"
            );
        }


        if (request.getLoginTime() == null) {

            throw new RuntimeException(
                    "Login time is required"
            );
        }


        if (request.getLogoutTime() == null) {

            throw new RuntimeException(
                    "Logout time is required"
            );
        }


        // ----------------------------------------------
        // CHECK DUPLICATE
        // ----------------------------------------------

        boolean alreadyExists =
                attendanceRepository
                        .existsByDoctorIdAndAttendanceDate(
                                request.getDoctorId(),
                                request.getAttendanceDate()
                        );


        if (alreadyExists) {

            throw new RuntimeException(
                    "Attendance already exists for "
                            + request.getDoctorName()
                            + " on "
                            + request.getAttendanceDate()
            );
        }


        // ----------------------------------------------
        // CHECK TIME
        // ----------------------------------------------

        if (!request.getLogoutTime()
                .isAfter(request.getLoginTime())) {

            throw new RuntimeException(
                    "Logout time must be after login time"
            );
        }


        // ----------------------------------------------
        // CALCULATE WORKING HOURS
        // ----------------------------------------------

        long minutes = Duration.between(
                request.getLoginTime(),
                request.getLogoutTime()
        ).toMinutes();


        double totalHours =
                minutes / 60.0;


        totalHours =
                Math.round(
                        totalHours * 100.0
                ) / 100.0;


        // ----------------------------------------------
        // CALCULATE OVERTIME
        // ----------------------------------------------

        double overtime = 0;


        if (totalHours > 8) {

            overtime =
                    totalHours - 8;
        }


        overtime =
                Math.round(
                        overtime * 100.0
                ) / 100.0;


        // ----------------------------------------------
        // DETERMINE STATUS
        // ----------------------------------------------

        String status;


        /*
         * Normal:
         * Login before or at 9:00 AM
         * and worked at least 8 hours.
         *
         * Irregular:
         * Worked less than 8 hours
         * OR logged in after 9:00 AM.
         */

        LocalTime normalLoginTime =
                LocalTime.of(9, 0);


        if (totalHours >= 8 &&
                !request.getLoginTime()
                        .isAfter(normalLoginTime)) {

            status = "NORMAL";

        } else {

            status = "IRREGULAR";
        }


        // ----------------------------------------------
        // CREATE ATTENDANCE
        // ----------------------------------------------

        Attendance attendance =
                new Attendance();


        attendance.setDoctorId(
                request.getDoctorId()
        );


        attendance.setDoctorName(
                request.getDoctorName()
        );


        attendance.setAttendanceDate(
                request.getAttendanceDate()
        );


        attendance.setLoginTime(
                request.getLoginTime()
        );


        attendance.setLogoutTime(
                request.getLogoutTime()
        );


        attendance.setTotalHours(
                totalHours
        );


        attendance.setOvertime(
                overtime
        );


        attendance.setStatus(
                status
        );


        // ----------------------------------------------
        // SAVE TO MYSQL
        // ----------------------------------------------

        return attendanceRepository.save(
                attendance
        );
    }


    // ==================================================
    // DELETE ATTENDANCE
    // ==================================================

    public void deleteAttendance(
            Long id) {

        if (!attendanceRepository
                .existsById(id)) {

            throw new RuntimeException(
                    "Attendance not found with ID: "
                            + id
            );
        }


        attendanceRepository.deleteById(id);
    }
}
