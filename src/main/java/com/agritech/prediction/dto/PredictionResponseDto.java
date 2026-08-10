package com.agritech.prediction.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PredictionResponseDto {

    private Long id;
    
    @JsonProperty("field_id")
    private String fieldId;
    
    private String satelliteSceneId;
    
    @JsonProperty("crop_type")
    private String cropType;
    
    @JsonProperty("crop_confidence")
    private Double cropConfidence;
    
    @JsonProperty("phenology_stage")
    private String phenologyStage;
    
    @JsonProperty("phenology_confidence")
    private Double phenologyConfidence;
    
    @JsonProperty("moisture_stress")
    private String moistureStress;
    
    @JsonProperty("stress_confidence")
    private Double stressConfidence;
    
    @JsonProperty("raster_s3_url")
    private String rasterS3Url;
    
    private Instant predictionDate;
    private Instant createdAt;
}
