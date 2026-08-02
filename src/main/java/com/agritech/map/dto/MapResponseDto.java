package com.agritech.map.dto;

import com.agritech.map.model.LayerType;
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
public class MapResponseDto {

    private Long id;
    private Long fieldId;
    private LayerType layerType;
    private String layerName;
    private String dataUrl;
    private String geoJsonData;
    private Instant captureDate;
    private Instant createdAt;
}