package com.hospital.hospitalManagement.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "blood_transactions")
public class BloodTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "blood_type", nullable = false)
    private String bloodType;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;

    public BloodTransaction() {
    }

    public BloodTransaction(String bloodType, String action, int quantity, LocalDateTime transactionDate) {
        this.bloodType = bloodType;
        this.action = action;
        this.quantity = quantity;
        this.transactionDate = transactionDate;
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

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }
}