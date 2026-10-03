package com.hospital.hospitalManagement.controller;

import com.hospital.hospitalManagement.dto.AttendanceRequest;
import com.hospital.hospitalManagement.entity.Attendance;
import com.hospital.hospitalManagement.service.AttendanceService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(
        origins = {
                "http://localhost:3000",
                "http://localhost:5173"
        }
)
public class AttendanceController {


    private final AttendanceService attendanceService;


    public AttendanceController(
            AttendanceService attendanceService) {

        this.attendanceService =
                attendanceService;
    }


    // ==================================================
    // GET ALL
    // ==================================================

    @GetMapping
    public ResponseEntity<List<Attendance>>
    getAllAttendance() {

        return ResponseEntity.ok(
                attendanceService.getAllAttendance()
        );
    }


    // ==================================================
    // GET BY DATE
    // ==================================================

    @GetMapping("/date/{date}")
    public ResponseEntity<?> getByDate(
            @PathVariable String date) {

        try {

            LocalDate localDate =
                    LocalDate.parse(date);

            return ResponseEntity.ok(
                    attendanceService
                            .getByDate(localDate)
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid date. Use YYYY-MM-DD");
        }
    }


    // ==================================================
    // SEARCH
    // ==================================================

    @GetMapping("/search")
    public ResponseEntity<List<Attendance>>
    search(
            @RequestParam String name) {

        return ResponseEntity.ok(
                attendanceService.search(name)
        );
    }


    // ==================================================
    // SEARCH BY DATE + NAME
    // ==================================================

    @GetMapping("/search/date")
    public ResponseEntity<?> searchByDate(

            @RequestParam String name,

            @RequestParam String date) {

        try {

            LocalDate localDate =
                    LocalDate.parse(date);

            return ResponseEntity.ok(
                    attendanceService
                            .searchByDate(
                                    name,
                                    localDate
                            )
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid date. Use YYYY-MM-DD");
        }
    }


    // ==================================================
    // MARK ATTENDANCE
    // ==================================================

    @PostMapping
    public ResponseEntity<?> markAttendance(
            @RequestBody AttendanceRequest request) {

        try {

            Attendance attendance =
                    attendanceService
                            .markAttendance(request);

            return ResponseEntity.ok(
                    attendance
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // ==================================================
    // DELETE
    // ==================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttendance(
            @PathVariable Long id) {

        try {

            attendanceService
                    .deleteAttendance(id);

            return ResponseEntity.ok(
                    "Attendance deleted successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}