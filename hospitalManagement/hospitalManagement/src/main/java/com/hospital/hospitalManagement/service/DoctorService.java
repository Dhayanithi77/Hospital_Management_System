package com.hospital.hospitalManagement.service;

import com.hospital.hospitalManagement.entity.Doctor;
import com.hospital.hospitalManagement.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(
            DoctorRepository doctorRepository
    ) {
        this.doctorRepository = doctorRepository;
    }

    // GET ALL
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // GET BY ID
    public Doctor getDoctorById(Long id) {

        return doctorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found with id: " + id
                        )
                );
    }

    // ADD
    public Doctor addDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    // UPDATE
    public Doctor updateDoctor(
            Long id,
            Doctor updatedDoctor
    ) {

        Doctor doctor =
                doctorRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found with id: " + id
                                )
                        );

        doctor.setName(
                updatedDoctor.getName()
        );

        doctor.setEmail(
                updatedDoctor.getEmail()
        );

        doctor.setDepartment(
                updatedDoctor.getDepartment()
        );

        doctor.setStatus(
                updatedDoctor.getStatus()
        );

        doctor.setShift(
                updatedDoctor.getShift()
        );

        doctor.setAvatar(
                updatedDoctor.getAvatar()
        );

        return doctorRepository.save(
                doctor
        );
    }

    // DELETE
    public void deleteDoctor(Long id) {

        if (!doctorRepository.existsById(id)) {

            throw new RuntimeException(
                    "Doctor not found with id: " + id
            );
        }

        doctorRepository.deleteById(id);
    }
}