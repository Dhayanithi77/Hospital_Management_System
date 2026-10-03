package com.hospital.hospitalManagement.controller;

import com.hospital.hospitalManagement.dto.BloodRecordRequest;
import com.hospital.hospitalManagement.entity.BloodInventory;
import com.hospital.hospitalManagement.entity.BloodTransaction;
import com.hospital.hospitalManagement.service.BloodBankService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blood-bank")
@CrossOrigin(origins = "http://localhost:3000")
public class BloodBankController {

    private final BloodBankService service;

    public BloodBankController(BloodBankService service) {
        this.service = service;
    }


    // ==========================================
    // DASHBOARD
    // ==========================================

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard() {

        return service.getDashboard();
    }


    // ==========================================
    // INVENTORY
    // ==========================================

    @GetMapping("/inventory")
    public List<BloodInventory> getInventory() {

        return service.getInventory();
    }


    // ==========================================
    // RECENT TRANSACTIONS
    // ==========================================

    @GetMapping("/transactions")
    public List<BloodTransaction> getTransactions() {

        return service.getRecentTransactions();
    }


    // ==========================================
    // DONATION / USAGE
    // ==========================================

    @PostMapping("/records")
    public BloodInventory updateInventory(
            @RequestBody BloodRecordRequest request) {

        return service.updateBloodInventory(request);
    }
}