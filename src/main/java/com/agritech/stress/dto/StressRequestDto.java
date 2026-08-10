package com.agritech.stress.dto;

import com.agritech.stress.model.StressLevel;
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
public class StressRequestDto {

    @NotNull(message = "fieldId is required")
    private Long fieldId;

    @NotNull(message = "stressLevel is required")
    private StressLevel stressLevel;

    @NotNull(message = "confidenceScore is required")
    @DecimalMin(value = "0.0", message = "confidenceScore must be >= 0")
    @DecimalMax(value = "1.0", message = "confidenceScore must be <= 1")
    private Double confidenceScore;

    private Double moistureIndex;

    private String satelliteSceneId;

    private Instant observationDate;
}