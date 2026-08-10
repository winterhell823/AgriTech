package com.agritech.phenology.repository;

import com.agritech.phenology.model.Phenology;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PhenologyRepository extends JpaRepository<Phenology, Long> {

    List<Phenology> findByFieldIdOrderByObservationDateDesc(Long fieldId);

    Optional<Phenology> findTopByFieldIdOrderByObservationDateDesc(Long fieldId);
}