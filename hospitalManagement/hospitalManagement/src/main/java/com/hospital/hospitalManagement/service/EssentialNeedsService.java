package com.hospital.hospitalManagement.service;

import com.hospital.hospitalManagement.entity.EssentialNeeds;
import com.hospital.hospitalManagement.repository.EssentialNeedsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EssentialNeedsService {

    private final EssentialNeedsRepository repository;

    public EssentialNeedsService(
            EssentialNeedsRepository repository) {

        this.repository = repository;
    }

    // Get current essential needs
    public EssentialNeeds getEssentialNeeds() {

        List<EssentialNeeds> data = repository.findAll();

        if (data.isEmpty()) {
            throw new RuntimeException(
                    "Essential needs data not found"
            );
        }

        return data.get(0);
    }

    // Add essential needs
    public EssentialNeeds addEssentialNeeds(
            EssentialNeeds essentialNeeds) {

        return repository.save(essentialNeeds);
    }

    // Update essential needs
    public EssentialNeeds updateEssentialNeeds(
            Long id,
            EssentialNeeds data) {

        EssentialNeeds existing =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Essential needs not found"
                                ));

        existing.setWaterLevel(
                data.getWaterLevel()
        );

        existing.setDailyWaterConsumption(
                data.getDailyWaterConsumption()
        );

        existing.setOxygenLevel(
                data.getOxygenLevel()
        );

        existing.setOxygenCylinders(
                data.getOxygenCylinders()
        );

        existing.setBackupCylinders(
                data.getBackupCylinders()
        );

        existing.setMainGridStatus(
                data.getMainGridStatus()
        );

        existing.setGeneratorStatus(
                data.getGeneratorStatus()
        );

        existing.setFuelLevel(
                data.getFuelLevel()
        );

        existing.setUpsBattery(
                data.getUpsBattery()
        );

        return repository.save(existing);
    }
}
