package com.agritech.satellite.dto;

import com.agritech.satellite.model.ProcessingStatus;
import com.agritech.satellite.model.SatelliteSource;
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
public class SatelliteResponseDto {

    private Long id;
    private String sceneId;
    private SatelliteSource source;
    private Long fieldId;
    private Instant captureDate;
    private Double cloudCoveragePct;
    private String s3Url;
    private ProcessingStatus status;
    private Instant createdAt;
}