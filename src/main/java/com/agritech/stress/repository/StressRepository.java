package com.agritech.stress.repository;

import com.agritech.stress.model.Stress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StressRepository extends JpaRepository<Stress, Long> {

    List<Stress> findByFieldIdOrderByObservationDateDesc(Long fieldId);

    Optional<Stress> findTopByFieldIdOrderByObservationDateDesc(Long fieldId);
}