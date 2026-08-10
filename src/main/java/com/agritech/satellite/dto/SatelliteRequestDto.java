package com.agritech.satellite.dto;

import com.agritech.satellite.model.SatelliteSource;
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
public class SatelliteRequestDto {

    @NotBlank(message = "sceneId is required")
    private String sceneId;

    @NotNull(message = "source is required")
    private SatelliteSource source;

    private Long fieldId;

    @NotNull(message = "captureDate is required")
    private Instant captureDate;

    private Double cloudCoveragePct;

    private String s3Url;
}