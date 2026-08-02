package com.agritech.field.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FieldRequestDto {

    @NotNull(message = "ownerId is required")
    private Long ownerId;

    @NotBlank(message = "name is required")
    private String name;

    private Double areaHectares;

    @NotBlank(message = "boundary GeoJSON is required")
    private String boundaryGeoJson; // GeoJSON Polygon string, e.g. from the frontend map draw tool
}