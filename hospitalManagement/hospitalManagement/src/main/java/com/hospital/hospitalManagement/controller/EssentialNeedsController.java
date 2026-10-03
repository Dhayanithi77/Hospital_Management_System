package com.hospital.hospitalManagement.controller;

import com.hospital.hospitalManagement.entity.EssentialNeeds;
import com.hospital.hospitalManagement.service.EssentialNeedsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/essential-needs")
@CrossOrigin(origins = "http://localhost:3000")
public class EssentialNeedsController {

    private final EssentialNeedsService service;

    public EssentialNeedsController(EssentialNeedsService service) {
        this.service = service;
    }
    // Get dashboard data
    @GetMapping
    public EssentialNeeds getEssentialNeeds() {
        return service.getEssentialNeeds();
    }
    // Add data
    @PostMapping
    public EssentialNeeds addEssentialNeeds(@RequestBody EssentialNeeds essentialNeeds) {
        return service.addEssentialNeeds(essentialNeeds);
    }
    // Update data
    @PutMapping("/{id}")
    public EssentialNeeds updateEssentialNeeds(@PathVariable Long id, @RequestBody EssentialNeeds data) {
        return service.updateEssentialNeeds(id, data);
    }
}