package com.hospital.hospitalManagement.service;

import com.hospital.hospitalManagement.entity.Vehicle;
import com.hospital.hospitalManagement.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class VehicleService {

    private final VehicleRepository repository;

    public VehicleService(VehicleRepository repository) {
        this.repository = repository;
    }

    // Get all vehicles
    public List<Vehicle> getAllVehicles() {
        return repository.findAll();
    }

    // Get vehicle by ID
    public Vehicle getVehicleById(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Vehicle not found"));
    }

    // Add vehicle
    public Vehicle addVehicle(Vehicle vehicle) {
        return repository.save(vehicle);
    }

    // Update vehicle
    public Vehicle updateVehicle(Long id, Vehicle vehicle) {

        Vehicle existing = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Vehicle not found"));

        existing.setVehicleType(vehicle.getVehicleType());
        existing.setAvailableCount(vehicle.getAvailableCount());
        existing.setTotalCount(vehicle.getTotalCount());
        existing.setLastService(vehicle.getLastService());
        existing.setNextServiceDue(vehicle.getNextServiceDue());

        return repository.save(existing);
    }

    // Delete vehicle
    public void deleteVehicle(Long id) {
        repository.deleteById(id);
    }

    // Dashboard
    public Map<String, Object> getDashboard() {

        Map<String, Object> dashboard = new HashMap<>();

        List<Vehicle> vehicles = repository.findAll();

        dashboard.put("vehicles", vehicles);

        // Maintenance alerts
        LocalDate today = LocalDate.now();

        long overdueCount = vehicles.stream()
                .filter(v ->
                        v.getNextServiceDue() != null &&
                                v.getNextServiceDue().isBefore(today)
                )
                .count();

        long upcomingCount = vehicles.stream()
                .filter(v ->
                        v.getNextServiceDue() != null &&
                                !v.getNextServiceDue().isBefore(today) &&
                                !v.getNextServiceDue().isAfter(today.plusDays(30))
                )
                .count();

        dashboard.put("overdueCount", overdueCount);
        dashboard.put("upcomingCount", upcomingCount);

        return dashboard;
    }
}