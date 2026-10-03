package com.hospital.hospitalManagement.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "food_consumption")
public class FoodConsumption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    private int mealsServed;

    private int mealCapacity;

    private double kitchenEfficiency;

    public FoodConsumption() {
    }

    public FoodConsumption(LocalDate date, int mealsServed, int mealCapacity, double kitchenEfficiency) {

        this.date = date;
        this.mealsServed = mealsServed;
        this.mealCapacity = mealCapacity;
        this.kitchenEfficiency = kitchenEfficiency;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getMealsServed() {
        return mealsServed;
    }

    public void setMealsServed(int mealsServed) {
        this.mealsServed = mealsServed;
    }

    public int getMealCapacity() {
        return mealCapacity;
    }

    public void setMealCapacity(int mealCapacity) {
        this.mealCapacity = mealCapacity;
    }

    public double getKitchenEfficiency() {
        return kitchenEfficiency;
    }

    public void setKitchenEfficiency(double kitchenEfficiency) {
        this.kitchenEfficiency = kitchenEfficiency;
    }
}