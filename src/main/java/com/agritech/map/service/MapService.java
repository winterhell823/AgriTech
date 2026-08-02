package com.agritech.map.service;

import com.agritech.map.dto.MapRequestDto;
import com.agritech.map.dto.MapResponseDto;
import com.agritech.map.model.LayerType;

import java.util.List;

public interface MapService {

    MapResponseDto create(MapRequestDto requestDto);

    List<MapResponseDto> getByField(Long fieldId);

    List<MapResponseDto> getByFieldAndType(Long fieldId, LayerType layerType);

    void delete(Long id);
}