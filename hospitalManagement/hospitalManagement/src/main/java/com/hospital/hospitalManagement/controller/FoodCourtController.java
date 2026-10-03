package com.hospital.hospitalManagement.controller;

import com.hospital.hospitalManagement.entity.FoodStock;
import com.hospital.hospitalManagement.service.FoodCourtService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/foodcourt")
@CrossOrigin(origins = "http://localhost:3000")
public class FoodCourtController {

    private final FoodCourtService service;

    public FoodCourtController(FoodCourtService service) {
        this.service = service;
    }

    // Get all food stock
    @GetMapping("/stock")
    public List<FoodStock> getAllFoodStock() {
        return service.getAllFoodStock();
    }

    // Add food stock
    @PostMapping("/stock")
    public FoodStock addFoodStock(@RequestBody FoodStock foodStock) {
        return service.addFoodStock(foodStock);
    }
    // Food court dashboard
    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardStats() {
        return service.getDashboardStats();
    }
}
