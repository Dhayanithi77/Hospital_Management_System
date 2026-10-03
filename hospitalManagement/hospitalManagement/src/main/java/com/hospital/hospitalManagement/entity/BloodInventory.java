package com.hospital.hospitalManagement.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "blood_inventory")
public class BloodInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "blood_type", unique = true, nullable = false)
    private String bloodType;

    @Column(nullable = false)
    private int units;

    public BloodInventory() {
    }
    public BloodInventory(String bloodType, int units) {
        this.bloodType = bloodType;
        this.units = units;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBloodType() {
        return bloodType;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }

    public int getUnits() {
        return units;
    }

    public void setUnits(int units) {
        this.units = units;
    }
}