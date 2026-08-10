package com.agritech.stress.dto;

import com.agritech.stress.model.StressLevel;
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
public class StressResponseDto {

    private Long id;
    private Long fieldId;
    private StressLevel stressLevel;
    private Double confidenceScore;
    private Double moistureIndex;
    private String satelliteSceneId;
    private Instant observationDate;
    private Instant createdAt;
}