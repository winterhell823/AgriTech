package com.agritech.field.dto;

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
public class FieldResponseDto {

    private Long id;
    private Long ownerId;
    private String name;
    private Double areaHectares;
    private String boundaryGeoJson;
    private Instant createdAt;
    private Instant updatedAt;
}