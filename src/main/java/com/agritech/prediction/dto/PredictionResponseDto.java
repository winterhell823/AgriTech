package com.agritech.prediction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PredictionResponseDto {

    private Long id;
    private Long fieldId;
    private String satelliteSceneId;
    private String cropType;
    private Double cropConfidence;
    private String growthStage;
    private Double phenologyConfidence;
    private String stressLevel;
    private Double stressConfidence;
    private Instant predictionDate;
    private Instant createdAt;
}