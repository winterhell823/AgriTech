package com.agritech.prediction.service;

import com.agritech.prediction.dto.PredictionRequestDto;
import com.agritech.prediction.dto.PredictionResponseDto;

public interface PredictionService {
    PredictionResponseDto getPredictionForField(String fieldId);
    PredictionResponseDto processPrediction(PredictionRequestDto requestDto);
}
