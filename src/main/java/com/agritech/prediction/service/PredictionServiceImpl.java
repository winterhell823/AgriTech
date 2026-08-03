package com.agritech.prediction.service;

import com.agritech.common.exception.ResourceNotFoundException;
import com.agritech.crop.dto.CropRequestDto;
import com.agritech.crop.service.CropService;
import com.agritech.phenology.dto.PhenologyRequestDto;
import com.agritech.phenology.model.GrowthStage;
import com.agritech.phenology.service.PhenologyService;
import com.agritech.prediction.dto.PredictionRequestDto;
import com.agritech.prediction.dto.PredictionResponseDto;
import com.agritech.prediction.model.Prediction;
import com.agritech.prediction.repository.PredictionRepository;
import com.agritech.stress.dto.StressRequestDto;
import com.agritech.stress.model.StressLevel;
import com.agritech.stress.service.StressService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PredictionServiceImpl implements PredictionService {

    private final PredictionRepository predictionRepository;
    private final CropService cropService;
    private final PhenologyService phenologyService;
    private final StressService stressService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${ai-service.base-url}")
    private String aiServiceBaseUrl;

    @Override
    @SuppressWarnings("unchecked")
    public PredictionResponseDto runPrediction(PredictionRequestDto requestDto) {
        Map<String, Object> payload = Map.of(
                "field_id", requestDto.getFieldId(),
                "satellite_scene_id", requestDto.getSatelliteSceneId()
        );

        Map<String, Object> aiResponse = restTemplate.postForObject(
                aiServiceBaseUrl + "/api/predict", payload, Map.class);

        if (aiResponse == null) {
            throw new IllegalStateException("AI service returned no response for field " + requestDto.getFieldId());
        }

        Map<String, Object> cropResult = (Map<String, Object>) aiResponse.get("crop");
        Map<String, Object> phenologyResult = (Map<String, Object>) aiResponse.get("phenology");
        Map<String, Object> stressResult = (Map<String, Object>) aiResponse.get("stress");

        String cropType = cropResult != null ? (String) cropResult.get("crop_type") : null;
        Double cropConfidence = cropResult != null ? ((Number) cropResult.get("confidence")).doubleValue() : null;

        String growthStage = phenologyResult != null ? (String) phenologyResult.get("growth_stage") : null;
        Double phenologyConfidence = phenologyResult != null
                ? ((Number) phenologyResult.get("confidence")).doubleValue() : null;

        String stressLevel = stressResult != null ? (String) stressResult.get("stress_level") : null;
        Double stressConfidence = stressResult != null
                ? ((Number) stressResult.get("confidence")).doubleValue() : null;
        Double moistureIndex = stressResult != null && stressResult.get("moisture_index") != null
                ? ((Number) stressResult.get("moisture_index")).doubleValue() : null;

        String rawJson;
        try {
            rawJson = objectMapper.writeValueAsString(aiResponse);
        } catch (Exception e) {
            log.warn("Could not serialize AI response for audit log", e);
            rawJson = null;
        }

        Prediction prediction = Prediction.builder()
                .fieldId(requestDto.getFieldId())
                .satelliteSceneId(requestDto.getSatelliteSceneId())
                .cropType(cropType)
                .cropConfidence(cropConfidence)
                .growthStage(growthStage)
                .phenologyConfidence(phenologyConfidence)
                .stressLevel(stressLevel)
                .stressConfidence(stressConfidence)
                .rawResponse(rawJson)
                .predictionDate(Instant.now())
                .build();

        Prediction saved = predictionRepository.save(prediction);

        if (cropType != null) {
            CropRequestDto cropDto = new CropRequestDto();
            cropDto.setFieldId(requestDto.getFieldId());
            cropDto.setCropType(cropType);
            cropDto.setConfidenceScore(cropConfidence);
            cropDto.setSatelliteSceneId(requestDto.getSatelliteSceneId());
            cropService.create(cropDto);
        }

        if (growthStage != null) {
            PhenologyRequestDto phenologyDto = new PhenologyRequestDto();
            phenologyDto.setFieldId(requestDto.getFieldId());
            phenologyDto.setGrowthStage(GrowthStage.valueOf(growthStage));
            phenologyDto.setConfidenceScore(phenologyConfidence);
            phenologyDto.setSatelliteSceneId(requestDto.getSatelliteSceneId());
            phenologyService.create(phenologyDto);
        }

        if (stressLevel != null) {
            StressRequestDto stressDto = new StressRequestDto();
            stressDto.setFieldId(requestDto.getFieldId());
            stressDto.setStressLevel(StressLevel.valueOf(stressLevel));
            stressDto.setConfidenceScore(stressConfidence);
            stressDto.setMoistureIndex(moistureIndex);
            stressDto.setSatelliteSceneId(requestDto.getSatelliteSceneId());
            stressService.create(stressDto);
        }

        return toDto(saved);
    }

    @Override
    public PredictionResponseDto getById(Long id) {
        Prediction prediction = predictionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prediction", "id", id));
        return toDto(prediction);
    }

    @Override
    public List<PredictionResponseDto> getByField(Long fieldId) {
        return predictionRepository.findByFieldIdOrderByPredictionDateDesc(fieldId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private PredictionResponseDto toDto(Prediction prediction) {
        return PredictionResponseDto.builder()
                .id(prediction.getId())
                .fieldId(prediction.getFieldId())
                .satelliteSceneId(prediction.getSatelliteSceneId())
                .cropType(prediction.getCropType())
                .cropConfidence(prediction.getCropConfidence())
                .growthStage(prediction.getGrowthStage())
                .phenologyConfidence(prediction.getPhenologyConfidence())
                .stressLevel(prediction.getStressLevel())
                .stressConfidence(prediction.getStressConfidence())
                .predictionDate(prediction.getPredictionDate())
                .createdAt(prediction.getCreatedAt())
                .build();
    }
}