package com.hospital.hospitalManagement.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "essential_needs")
public class EssentialNeeds {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Water
    private int waterLevel;
    private int dailyWaterConsumption;

    // Oxygen
    private int oxygenLevel;
    private int oxygenCylinders;
    private int backupCylinders;

    // Power
    private String mainGridStatus;
    private String generatorStatus;
    private int fuelLevel;
    private int upsBattery;

    public EssentialNeeds() {
    }

    public EssentialNeeds(int waterLevel, int dailyWaterConsumption, int oxygenLevel, int oxygenCylinders, int backupCylinders, String mainGridStatus, String generatorStatus, int fuelLevel, int upsBattery) {
        this.waterLevel = waterLevel;
        this.dailyWaterConsumption = dailyWaterConsumption;
        this.oxygenLevel = oxygenLevel;
        this.oxygenCylinders = oxygenCylinders;
        this.backupCylinders = backupCylinders;
        this.mainGridStatus = mainGridStatus;
        this.generatorStatus = generatorStatus;
        this.fuelLevel = fuelLevel;
        this.upsBattery = upsBattery;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getWaterLevel() {
        return waterLevel;
    }

    public void setWaterLevel(int waterLevel) {
        this.waterLevel = waterLevel;
    }

    public int getDailyWaterConsumption() {
        return dailyWaterConsumption;
    }

    public void setDailyWaterConsumption(int dailyWaterConsumption) {
        this.dailyWaterConsumption = dailyWaterConsumption;
    }

    public int getOxygenLevel() {
        return oxygenLevel;
    }

    public void setOxygenLevel(int oxygenLevel) {
        this.oxygenLevel = oxygenLevel;
    }

    public int getOxygenCylinders() {
        return oxygenCylinders;
    }

    public void setOxygenCylinders(int oxygenCylinders) {
        this.oxygenCylinders = oxygenCylinders;
    }

    public int getBackupCylinders() {
        return backupCylinders;
    }

    public void setBackupCylinders(int backupCylinders) {
        this.backupCylinders = backupCylinders;
    }

    public String getMainGridStatus() {
        return mainGridStatus;
    }

    public void setMainGridStatus(String mainGridStatus) {
        this.mainGridStatus = mainGridStatus;
    }

    public String getGeneratorStatus() {
        return generatorStatus;
    }

    public void setGeneratorStatus(String generatorStatus) {
        this.generatorStatus = generatorStatus;
    }

    public int getFuelLevel() {
        return fuelLevel;
    }

    public void setFuelLevel(int fuelLevel) {
        this.fuelLevel = fuelLevel;
    }

    public int getUpsBattery() {
        return upsBattery;
    }

    public void setUpsBattery(int upsBattery) {
        this.upsBattery = upsBattery;
    }
}