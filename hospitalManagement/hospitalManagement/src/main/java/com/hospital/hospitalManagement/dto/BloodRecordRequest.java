package com.hospital.hospitalManagement.dto;

public class BloodRecordRequest {

    private String bloodType;

    private int quantity;

    private String action;

    public BloodRecordRequest() {
    }

    public String getBloodType() {

        return bloodType;
    }

    public void setBloodType(String bloodType) {

        this.bloodType = bloodType;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}