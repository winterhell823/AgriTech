package com.agritech.satellite.service;

import com.agritech.satellite.dto.SatelliteRequestDto;
import com.agritech.satellite.dto.SatelliteResponseDto;

import java.util.List;

public interface SatelliteService {

    SatelliteResponseDto register(SatelliteRequestDto requestDto);

    SatelliteResponseDto getById(Long id);

    SatelliteResponseDto getBySceneId(String sceneId);

    List<SatelliteResponseDto> getByField(Long fieldId);

    SatelliteResponseDto getLatestByField(Long fieldId);

    void delete(Long id);
}