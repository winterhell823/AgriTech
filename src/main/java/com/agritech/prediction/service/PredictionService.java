package com.agritech.prediction.service;

import com.agritech.prediction.dto.PredictionRequestDto;
import com.agritech.prediction.dto.PredictionResponseDto;

import java.util.List;

public interface PredictionService {

    /** Calls the Python AI service, persists a Prediction record, and fans results
     *  out into the crop and phenology modules (and stress, once that module exists). */
    PredictionResponseDto runPrediction(PredictionRequestDto requestDto);

    PredictionResponseDto getById(Long id);

    List<PredictionResponseDto> getByField(Long fieldId);
}