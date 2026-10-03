package com.hospital.hospitalManagement.controller;

import com.hospital.hospitalManagement.entity.Medicine;
import com.hospital.hospitalManagement.service.MedicineService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "http://localhost:3000")
public class MedicineController {

        private final MedicineService service;

        public MedicineController(MedicineService service) {
            this.service = service;
        }
        @GetMapping
        public List<Medicine> getAllMedicines() {
            return service.getAllMedicines();
        }
        @GetMapping("/{id}")
        public Medicine getMedicine(@PathVariable Long id) {
            return service.getMedicineById(id);
        }
    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardStats() {
        return service.getDashboardStats();
    }

        @PostMapping
        public Medicine addMedicine(@RequestBody Medicine medicine) {
            return service.addMedicine(medicine);
        }

        @PutMapping("/{id}")
        public Medicine updateMedicine(@PathVariable Long id, @RequestBody Medicine medicine) {
            return service.updateMedicine(id, medicine);
        }

        @DeleteMapping("/{id}")
        public void deleteMedicine(@PathVariable Long id) {
            service.deleteMedicine(id);
        }
    }
