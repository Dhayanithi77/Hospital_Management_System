package com.hospital.hospitalManagement.service;

import com.hospital.hospitalManagement.dto.BloodRecordRequest;
import com.hospital.hospitalManagement.entity.BloodInventory;
import com.hospital.hospitalManagement.entity.BloodTransaction;
import com.hospital.hospitalManagement.repository.BloodInventoryRepository;
import com.hospital.hospitalManagement.repository.BloodTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BloodBankService {

    private final BloodInventoryRepository inventoryRepository;
    private final BloodTransactionRepository transactionRepository;

    public BloodBankService(
            BloodInventoryRepository inventoryRepository,
            BloodTransactionRepository transactionRepository) {

        this.inventoryRepository = inventoryRepository;
        this.transactionRepository = transactionRepository;
    }

    // ==========================================
    // GET INVENTORY
    // ==========================================

    public List<BloodInventory> getInventory() {
        return inventoryRepository.findAll();
    }


    // ==========================================
    // GET RECENT TRANSACTIONS
    // ==========================================

    public List<BloodTransaction> getRecentTransactions() {

        return transactionRepository
                .findTop10ByOrderByTransactionDateDesc();
    }


    // ==========================================
    // ADD / USE BLOOD
    // ==========================================

    @Transactional
    public BloodInventory updateBloodInventory(
            BloodRecordRequest request) {

        if (request.getQuantity() <= 0) {
            throw new RuntimeException(
                    "Quantity must be greater than 0"
            );
        }

        String bloodType =
                request.getBloodType().trim();

        String action =
                request.getAction().trim();


        // Find inventory row and lock it
        BloodInventory inventory =
                inventoryRepository
                        .findByBloodTypeForUpdate(bloodType)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Blood type not found: "
                                                + bloodType
                                ));


        // ======================================
        // DONATION
        // ======================================

        if (action.equalsIgnoreCase("Donation")) {

            inventory.setUnits(
                    inventory.getUnits()
                            + request.getQuantity()
            );

        }


        // ======================================
        // USAGE
        // ======================================

        else if (action.equalsIgnoreCase("Usage")) {

            if (inventory.getUnits()
                    < request.getQuantity()) {

                throw new RuntimeException(
                        "Insufficient blood available. "
                                + "Available: "
                                + inventory.getUnits()
                                + " units"
                );
            }

            inventory.setUnits(
                    inventory.getUnits()
                            - request.getQuantity()
            );

        }


        else {

            throw new RuntimeException(
                    "Action must be Donation or Usage"
            );
        }


        // Save updated inventory
        BloodInventory updatedInventory =
                inventoryRepository.save(inventory);


        // ======================================
        // SAVE TRANSACTION HISTORY
        // ======================================

        BloodTransaction transaction =
                new BloodTransaction();

        transaction.setBloodType(bloodType);
        transaction.setAction(action);
        transaction.setQuantity(request.getQuantity());
        transaction.setTransactionDate(
                LocalDateTime.now()
        );

        transactionRepository.save(transaction);


        return updatedInventory;
    }


    // ==========================================
    // DASHBOARD
    // ==========================================

    public Map<String, Object> getDashboard() {

        Map<String, Object> dashboard =
                new HashMap<>();

        dashboard.put(
                "inventory",
                inventoryRepository.findAll()
        );

        dashboard.put(
                "recentTransactions",
                transactionRepository
                        .findTop10ByOrderByTransactionDateDesc()
        );

        return dashboard;
    }
}