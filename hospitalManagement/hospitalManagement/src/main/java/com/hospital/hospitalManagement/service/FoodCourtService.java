package com.hospital.hospitalManagement.service;

import com.hospital.hospitalManagement.entity.FoodConsumption;
import com.hospital.hospitalManagement.entity.FoodStock;
import com.hospital.hospitalManagement.repository.FoodConsumptionRepository;
import com.hospital.hospitalManagement.repository.FoodStockRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FoodCourtService {

    private final FoodStockRepository foodStockRepository;
    private final FoodConsumptionRepository foodConsumptionRepository;

    public FoodCourtService(
            FoodStockRepository foodStockRepository,
            FoodConsumptionRepository foodConsumptionRepository) {

        this.foodStockRepository = foodStockRepository;
        this.foodConsumptionRepository = foodConsumptionRepository;
    }

    // Get all food stock
    public List<FoodStock> getAllFoodStock() {
        return foodStockRepository.findAll();
    }

    // Add food item
    public FoodStock addFoodStock(FoodStock foodStock) {
        return foodStockRepository.save(foodStock);
    }

    // Get dashboard data
    public Map<String, Object> getDashboardStats() {

        Map<String, Object> dashboard = new HashMap<>();

        // -----------------------------
        // FOOD STOCK
        // -----------------------------

        List<FoodStock> stocks = foodStockRepository.findAll();

        dashboard.put("stocks", stocks);


        // -----------------------------
        // CONSUMPTION
        // -----------------------------

        Optional<FoodConsumption> latestConsumption =
                foodConsumptionRepository.findTopByOrderByDateDesc();

        if (latestConsumption.isPresent()) {

            FoodConsumption consumption =
                    latestConsumption.get();

            dashboard.put(
                    "mealsServed",
                    consumption.getMealsServed()
            );

            dashboard.put(
                    "mealCapacity",
                    consumption.getMealCapacity()
            );

            dashboard.put(
                    "kitchenEfficiency",
                    consumption.getKitchenEfficiency()
            );

        } else {

            dashboard.put("mealsServed", 0);
            dashboard.put("mealCapacity", 0);
            dashboard.put("kitchenEfficiency", 0);
        }


        // -----------------------------
        // AI SUGGESTION
        // -----------------------------

        String suggestion = generateSuggestion(stocks);

        dashboard.put("aiSuggestion", suggestion);

        return dashboard;
    }


    // Simple suggestion based on stock
    private String generateSuggestion(List<FoodStock> stocks) {

        for (FoodStock food : stocks) {

            if (food.isAlert()) {

                return "Increase "
                        + food.getItem()
                        + " order based on current stock levels.";
            }
        }

        return "Food stock levels are currently sufficient.";
    }
}