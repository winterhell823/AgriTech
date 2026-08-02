package com.agritech.map.dto;

import com.agritech.map.model.LayerType;
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
public class MapRequestDto {

    @NotNull(message = "fieldId is required")
    private Long fieldId;

    @NotNull(message = "layerType is required")
    private LayerType layerType;

    @NotBlank(message = "layerName is required")
    private String layerName;

    private String dataUrl;

    private String geoJsonData;

    private Instant captureDate;
}