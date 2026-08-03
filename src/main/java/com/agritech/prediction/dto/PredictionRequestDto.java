package com.agritech.prediction.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PredictionRequestDto {

    @NotNull(message = "fieldId is required")
    private Long fieldId;

    private String satelliteSceneId; // optional — if omitted, AI service picks the latest available scene
}