package com.hospital.hospitalManagement.service;


import com.hospital.hospitalManagement.entity.Medicine;
import com.hospital.hospitalManagement.repository.MedicineRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
public class MedicineService {

        private final MedicineRepository repository;

        public MedicineService(MedicineRepository repository) {
            this.repository = repository;
        }

        public List<Medicine> getAllMedicines() {
            return repository.findAll();
        }

        public Medicine getMedicineById(Long id) {
            return repository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Medicine not found"));
        }

        public Medicine addMedicine(Medicine medicine) {
            return repository.save(medicine);
        }

        public Medicine updateMedicine(Long id, Medicine medicine) {

            Medicine existing = repository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Medicine not found"));

            existing.setName(medicine.getName());
            existing.setStockCount(medicine.getStockCount());
            existing.setStatus(medicine.getStatus());
            existing.setExpiry(medicine.getExpiry());

            return repository.save(existing);
        }

        public void deleteMedicine(Long id) {
            repository.deleteById(id);
        }

        public Map<String, Object> getDashboardStats() {

            Map<String, Object> stats = new HashMap<>();

            Long totalStock = repository.getTotalStock();

            Long lowStock = repository.getLowStockCount();

            LocalDate today = LocalDate.now();
            LocalDate endDate = today.plusDays(30);

            Long expiringSoon =
                    repository.getExpiringSoonCount(today, endDate);

            stats.put("totalStock", totalStock);
            stats.put("lowStock", lowStock);
            stats.put("expiringSoon", expiringSoon);

            return stats;
        }

}
