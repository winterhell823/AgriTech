package com.agritech.prediction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PredictionResponseDto {
    private String field_id;
    private String crop_type;
    private Double crop_confidence;
    private String phenology_stage;
    private Double phenology_confidence;
    private String moisture_stress;
    private Double stress_confidence;
    private String raster_s3_url;
}
