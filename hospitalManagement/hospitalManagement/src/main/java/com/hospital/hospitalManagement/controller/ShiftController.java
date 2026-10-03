package com.hospital.hospitalManagement.controller;

import com.hospital.hospitalManagement.dto.ShiftRequest;
import com.hospital.hospitalManagement.entity.Shift;
import com.hospital.hospitalManagement.service.ShiftService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shifts")
@CrossOrigin(origins = "http://localhost:3000")
public class ShiftController {

    private final ShiftService shiftService;


    public ShiftController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }
    // =========================================================
    // GET ALL SHIFTS
    // =========================================================
    @GetMapping
    public ResponseEntity<List<Shift>> getAllShifts() {

        return ResponseEntity.ok(shiftService.getAllShifts());
    }
    // =========================================================
    // GET SHIFTS BY DAY
    // =========================================================
    @GetMapping("/day/{day}")
    public ResponseEntity<List<Shift>> getShiftsByDay(@PathVariable String day) {
        return ResponseEntity.ok(shiftService.getShiftsByDay(day));
    }
    // =========================================================
    // ADD SHIFT
    // =========================================================
    @PostMapping
    public ResponseEntity<?> addShift(@RequestBody ShiftRequest request) {
        try {
            Shift shift = shiftService.addShift(request);
            return ResponseEntity.ok(shift);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
    // =========================================================
    // UPDATE SHIFT
    // =========================================================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateShift(@PathVariable Long id, @RequestBody ShiftRequest request) {
        try {
            Shift shift = shiftService.updateShift(id, request);
            return ResponseEntity.ok(shift);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
    // =========================================================
    // DELETE SHIFT
    // =========================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteShift(@PathVariable Long id) {
        try {
            shiftService.deleteShift(id);
            return ResponseEntity.ok("Shift deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}