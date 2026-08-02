package com.agritech.crop.repository;

import com.agritech.crop.model.Crop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CropRepository extends JpaRepository<Crop, Long> {

    List<Crop> findByFieldIdOrderByClassificationDateDesc(Long fieldId);

    Optional<Crop> findTopByFieldIdOrderByClassificationDateDesc(Long fieldId);
}