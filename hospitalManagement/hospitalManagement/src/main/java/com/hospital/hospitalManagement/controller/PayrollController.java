package com.hospital.hospitalManagement.controller;

import com.hospital.hospitalManagement.entity.Payroll;
import com.hospital.hospitalManagement.service.PayrollService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class PayrollController {

    private final PayrollService payrollService;

    public PayrollController(PayrollService payrollService) {

        this.payrollService = payrollService;
    }

    @GetMapping
    public ResponseEntity<List<Payroll>>
    getAllPayroll() {

        return ResponseEntity.ok(payrollService.getAllPayroll());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Payroll>>
    searchPayroll(@RequestParam String name) {

        return ResponseEntity.ok(payrollService.searchPayroll(name));
    }

    @PostMapping
    public ResponseEntity<?> addPayroll(@RequestBody Payroll payroll) {
        try {
            Payroll saved = payrollService.addPayroll(payroll);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePayroll(@PathVariable Long id) {
        try {
            payrollService.deletePayroll(id);
            return ResponseEntity.ok("Payroll deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}
