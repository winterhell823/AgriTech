package com.agritech.phenology.dto;

import com.agritech.phenology.model.GrowthStage;
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
public class PhenologyResponseDto {

    private Long id;
    private Long fieldId;
    private GrowthStage growthStage;
    private Double confidenceScore;
    private String satelliteSceneId;
    private Instant observationDate;
    private Instant createdAt;
}