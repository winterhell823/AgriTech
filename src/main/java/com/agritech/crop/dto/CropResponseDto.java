package com.agritech.crop.dto;

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
public class CropResponseDto {

    private Long id;
    private Long fieldId;
    private String cropType;
    private Double confidenceScore;
    private String satelliteSceneId;
    private Instant classificationDate;
    private Instant createdAt;
}