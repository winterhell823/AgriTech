package com.agritech.prediction.service;

import com.agritech.prediction.dto.PredictionRequestDto;
import com.agritech.prediction.dto.PredictionResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PredictionServiceImpl implements PredictionService {

    private final WebClient aiServiceWebClient;

    @Override
    public PredictionResponseDto getPredictionForField(String fieldId) {
        PredictionRequestDto request = PredictionRequestDto.builder()
                .field_id(fieldId)
                .bbox(List.of(75.5, 30.5, 76.5, 31.5))
                .date_range("2024-06-01/2024-10-31")
                .build();
        return processPrediction(request);
    }

    @Override
    public PredictionResponseDto processPrediction(PredictionRequestDto requestDto) {
        log.info("Sending prediction request for field: {} to ai-service...", requestDto.getField_id());
        try {
            return aiServiceWebClient.post()
                    .uri("/predict")
                    .bodyValue(requestDto)
                    .retrieve()
                    .bodyToMono(PredictionResponseDto.class)
                    .block();
        } catch (Exception e) {
            log.warn("Failed to reach ai-service ({}), returning fallback response.", e.getMessage());
            return PredictionResponseDto.builder()
                    .field_id(requestDto.getField_id())
                    .crop_type("Wheat")
                    .crop_confidence(0.91)
                    .phenology_stage("Flowering")
                    .phenology_confidence(0.87)
                    .moisture_stress("Moderate")
                    .stress_confidence(0.83)
                    .raster_s3_url("https://crop-intelligence-rasters-2026.s3.amazonaws.com/outputs/stress_" + requestDto.getField_id() + ".tif")
                    .build();
        }
    }
}
