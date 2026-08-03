package com.agritech.prediction.repository;

import com.agritech.prediction.model.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {

    List<Prediction> findByFieldIdOrderByPredictionDateDesc(Long fieldId);
}