package com.hospital.hospitalManagement.service;

import com.hospital.hospitalManagement.entity.Payroll;
import com.hospital.hospitalManagement.repository.PayrollRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PayrollService {

    private final PayrollRepository payrollRepository;

    public PayrollService(PayrollRepository payrollRepository) {

        this.payrollRepository = payrollRepository;
    }

    public List<Payroll> getAllPayroll() {

        return payrollRepository.findAll();
    }

    public List<Payroll> searchPayroll(String name) {

        return payrollRepository .findByDoctorNameContainingIgnoreCase(name);
    }

    public Payroll addPayroll(
            Payroll payroll) {

        if (payroll.getDoctorId() == null) {
            throw new RuntimeException("Doctor is required");
        }

        if (payroll.getDoctorName() == null || payroll.getDoctorName().isBlank()) {

            throw new RuntimeException("Doctor name is required");
        }

        if (payroll.getSalary() == null || payroll.getSalary() <= 0) {
            throw new RuntimeException("Salary must be greater than 0");
        }

        if (payroll.getSalaryMonth() == null || payroll.getSalaryMonth().isBlank()) {
            throw new RuntimeException("Salary month is required");
        }
        if (payroll.getPaymentDate() == null) {
            throw new RuntimeException("Payment date is required");
        }

        if (payroll.getStatus() == null || payroll.getStatus().isBlank()) {

            payroll.setStatus("PENDING");
        }

        return payrollRepository.save(payroll);
    }

    public void deletePayroll(Long id) {
        if (!payrollRepository.existsById(id)) {
            throw new RuntimeException("Payroll record not found");
        }
        payrollRepository.deleteById(id);
    }
}
