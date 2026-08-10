package com.agritech.weather.dto;

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
public class WeatherResponseDto {

    private Long id;
    private Long fieldId;
    private Double temperatureCelsius;
    private Double humidityPct;
    private Double rainfallMm;
    private Double windSpeedKmh;
    private String source;
    private Instant recordedAt;
    private Instant createdAt;
}