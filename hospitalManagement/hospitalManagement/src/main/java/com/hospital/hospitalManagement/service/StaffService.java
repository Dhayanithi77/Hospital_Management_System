package com.hospital.hospitalManagement.service;

import com.hospital.hospitalManagement.dto.StaffRequest;
import com.hospital.hospitalManagement.entity.Staff;
import com.hospital.hospitalManagement.repository.StaffRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StaffService {

    private final StaffRepository staffRepository;

    public StaffService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    // GET ALL STAFF
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    // GET STAFF BY ID
    public Staff getStaffById(Long id) {

        return staffRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Staff member not found with id: " + id)
                );
    }

    // GET STAFF BY DEPARTMENT
    public List<Staff> getStaffByDepartment(String department) {
        return staffRepository.findByDepartment(department);
    }

    // ADD STAFF
    public Staff addStaff(StaffRequest request) {

        if (request.getName() == null ||
                request.getName().trim().isEmpty()) {

            throw new RuntimeException("Staff name is required");
        }

        if (request.getRole() == null ||
                request.getRole().trim().isEmpty()) {

            throw new RuntimeException("Staff role is required");
        }

        if (request.getDepartment() == null ||
                request.getDepartment().trim().isEmpty()) {

            throw new RuntimeException("Department is required");
        }

        Staff staff = new Staff();

        staff.setName(request.getName().trim());

        staff.setRole(request.getRole().trim());

        staff.setDepartment(request.getDepartment().trim());

        staff.setAssignedTo(request.getAssignedTo());

        if (request.getTasks() != null) {
            staff.setTasks(request.getTasks());
        } else {
            staff.setTasks(new ArrayList<>());
        }

        return staffRepository.save(staff);
    }

    // UPDATE STAFF
    public Staff updateStaff(Long id, StaffRequest request) {

        Staff staff = staffRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Staff member not found")
                );

        staff.setName(request.getName());

        staff.setRole(request.getRole());

        staff.setDepartment(request.getDepartment());

        staff.setAssignedTo(request.getAssignedTo());

        if (request.getTasks() != null) {
            staff.setTasks(request.getTasks());
        } else {
            staff.setTasks(new ArrayList<>());
        }

        return staffRepository.save(staff);
    }

    // DELETE STAFF
    public void deleteStaff(Long id) {

        if (!staffRepository.existsById(id)) {
            throw new RuntimeException("Staff member not found");
        }

        staffRepository.deleteById(id);
    }
}
