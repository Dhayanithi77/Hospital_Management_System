package com.hospital.hospitalManagement.service;

import com.hospital.hospitalManagement.dto.ShiftRequest;
import com.hospital.hospitalManagement.entity.Shift;
import com.hospital.hospitalManagement.repository.ShiftRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShiftService {

    private final ShiftRepository shiftRepository;

    public ShiftService(
            ShiftRepository shiftRepository
    ) {
        this.shiftRepository = shiftRepository;
    }


    // =========================================================
    // GET ALL SHIFTS
    // =========================================================

    public List<Shift> getAllShifts() {

        return shiftRepository.findAll();
    }


    // =========================================================
    // GET SHIFTS BY DAY
    // =========================================================

    public List<Shift> getShiftsByDay(
            String day
    ) {

        return shiftRepository.findByDay(day);
    }


    // =========================================================
    // ADD SHIFT
    // =========================================================

    public Shift addShift(
            ShiftRequest request
    ) {

        // -----------------------------------------------------
        // VALIDATION
        // -----------------------------------------------------

        if (request.getDoctorId() == null) {

            throw new RuntimeException(
                    "Doctor is required"
            );
        }


        if (request.getDay() == null ||
                request.getDay().isBlank()) {

            throw new RuntimeException(
                    "Day is required"
            );
        }


        if (request.getType() == null ||
                request.getType().isBlank()) {

            throw new RuntimeException(
                    "Shift type is required"
            );
        }


        if (request.getStartTime() == null ||
                request.getStartTime().isBlank()) {

            throw new RuntimeException(
                    "Start time is required"
            );
        }


        if (request.getEndTime() == null ||
                request.getEndTime().isBlank()) {

            throw new RuntimeException(
                    "End time is required"
            );
        }


        // -----------------------------------------------------
        // CHECK DUPLICATE
        // -----------------------------------------------------

        boolean exists =
                shiftRepository
                        .existsByDoctorIdAndDayAndType(
                                request.getDoctorId(),
                                request.getDay(),
                                request.getType()
                        );


        if (exists) {

            throw new RuntimeException(
                    "Doctor already has a "
                            + request.getType()
                            + " shift on "
                            + request.getDay()
            );
        }


        // -----------------------------------------------------
        // CREATE SHIFT
        // -----------------------------------------------------

        Shift shift = new Shift();

        shift.setDoctorId(
                request.getDoctorId()
        );

        /*
         * We will fill doctorName from frontend
         * for now if you don't want to connect
         * DoctorRepository here.
         *
         * The frontend can send doctorName later.
         */

        shift.setDay(
                request.getDay()
        );

        shift.setType(
                request.getType()
        );

        shift.setStartTime(
                request.getStartTime()
        );

        shift.setEndTime(
                request.getEndTime()
        );


        return shiftRepository.save(
                shift
        );
    }


    // =========================================================
    // UPDATE SHIFT
    // =========================================================

    public Shift updateShift(
            Long id,
            ShiftRequest request
    ) {

        Shift shift =
                shiftRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Shift not found"
                                        )
                        );


        shift.setDoctorId(
                request.getDoctorId()
        );

        shift.setDay(
                request.getDay()
        );

        shift.setType(
                request.getType()
        );

        shift.setStartTime(
                request.getStartTime()
        );

        shift.setEndTime(
                request.getEndTime()
        );


        return shiftRepository.save(
                shift
        );
    }


    // =========================================================
    // DELETE SHIFT
    // =========================================================

    public void deleteShift(
            Long id
    ) {

        if (!shiftRepository.existsById(id)) {

            throw new RuntimeException(
                    "Shift not found"
            );
        }


        shiftRepository.deleteById(
                id
        );
    }
}