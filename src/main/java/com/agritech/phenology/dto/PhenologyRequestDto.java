package com.agritech.phenology.dto;

import com.agritech.phenology.model.GrowthStage;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhenologyRequestDto {

    @NotNull(message = "fieldId is required")
    private Long fieldId;

    @NotNull(message = "growthStage is required")
    private GrowthStage growthStage;

    @NotNull(message = "confidenceScore is required")
    @DecimalMin(value = "0.0", message = "confidence must be >= 0")
    @DecimalMax(value = "1.0", message = "confidenceScore must be <= 1")
    private Double confidenceScore;

    private String satelliteSceneId;
    private Instant observationDate;
}