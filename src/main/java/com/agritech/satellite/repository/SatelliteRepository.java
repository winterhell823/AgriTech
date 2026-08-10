package com.agritech.satellite.repository;

import com.agritech.satellite.model.Satellite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SatelliteRepository extends JpaRepository<Satellite, Long> {

    Optional<Satellite> findBySceneId(String sceneId);

    List<Satellite> findByFieldIdOrderByCaptureDateDesc(Long fieldId);

    Optional<Satellite> findTopByFieldIdOrderByCaptureDateDesc(Long fieldId);
}