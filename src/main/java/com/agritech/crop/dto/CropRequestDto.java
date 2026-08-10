package com.agritech.crop.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
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
public class CropRequestDto {

    @NotNull(message = "fieldId is required")
    private Long fieldId;

    @NotBlank(message = "cropType is required")
    private String cropType;

    @NotNull(message = "confidenceScore is required")
    @DecimalMin(value = "0.0", message = "confidenceScore must be >= 0")
    @DecimalMax(value = "1.0", message = "confidence must be <= 1")
    private Double confidenceScore;

    private String satelliteSceneId;

    private Instant classificationDate;
}