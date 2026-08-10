package com.agritech.prediction.service;

import com.agritech.prediction.dto.PredictionRequestDto;
import com.agritech.prediction.dto.PredictionResponseDto;

import java.util.List;

public interface PredictionService {
    PredictionResponseDto getPredictionForField(String fieldId);
    PredictionResponseDto processPrediction(PredictionRequestDto requestDto);
    PredictionResponseDto runPrediction(PredictionRequestDto requestDto);
    PredictionResponseDto getById(Long id);
    List<PredictionResponseDto> getByField(String fieldId);
}
