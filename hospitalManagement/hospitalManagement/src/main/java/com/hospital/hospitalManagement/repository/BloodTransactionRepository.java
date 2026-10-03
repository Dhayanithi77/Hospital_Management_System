package com.hospital.hospitalManagement.repository;

import com.hospital.hospitalManagement.entity.BloodTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BloodTransactionRepository
        extends JpaRepository<BloodTransaction, Long> {

    List<BloodTransaction>
    findTop10ByOrderByTransactionDateDesc();
}