package com.hospital.hospitalManagement.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "food_stock")
public class FoodStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String item;

    private double stock;

    private String unit;

    private boolean alert;

    public FoodStock() {
    }

    public FoodStock(String item, double stock, String unit, boolean alert) {
        this.item = item;
        this.stock = stock;
        this.unit = unit;
        this.alert = alert;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getItem() {
        return item;
    }

    public void setItem(String item) {
        this.item = item;
    }

    public double getStock() {
        return stock;
    }

    public void setStock(double stock) {
        this.stock = stock;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public boolean isAlert() {
        return alert;
    }

    public void setAlert(boolean alert) {
        this.alert = alert;
    }
}
