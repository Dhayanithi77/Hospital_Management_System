package com.hospital.hospitalManagement.controller;

import com.hospital.hospitalManagement.entity.Vehicle;
import com.hospital.hospitalManagement.service.VehicleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:3000")
public class VehicleController {

    private final VehicleService service;

    public VehicleController(VehicleService service) {
        this.service = service;
    }

    // Get all vehicles
    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return service.getAllVehicles();
    }

    // Dashboard
    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard() {
        return service.getDashboard();
    }

    // Get vehicle by ID
    @GetMapping("/{id}")
    public Vehicle getVehicle(@PathVariable Long id) {
        return service.getVehicleById(id);
    }

    // Add vehicle
    @PostMapping
    public Vehicle addVehicle(@RequestBody Vehicle vehicle) {
        return service.addVehicle(vehicle);
    }

    // Update vehicle
    @PutMapping("/{id}")
    public Vehicle updateVehicle(
            @PathVariable Long id,
            @RequestBody Vehicle vehicle) {

        return service.updateVehicle(id, vehicle);
    }

    // Delete vehicle
    @DeleteMapping("/{id}")
    public void deleteVehicle(@PathVariable Long id) {
        service.deleteVehicle(id);
    }
}