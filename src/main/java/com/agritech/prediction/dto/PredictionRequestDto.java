package com.agritech.prediction.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PredictionRequestDto {
    
    @JsonProperty("field_id")
    private String fieldId;
    
    private List<Double> bbox;
    
    @JsonProperty("date_range")
    private String dateRange;
    
    private String satelliteSceneId;
}
