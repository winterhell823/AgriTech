package com.agritech.weather.dto;

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
public class WeatherRequestDto {

    @NotNull(message = "fieldId is required")
    private Long fieldId;

    private Double temperatureCelsius;

    private Double humidityPct;

    private Double rainfallMm;

    private Double windSpeedKmh;

    private String source;

    private Instant recordedAt;
}