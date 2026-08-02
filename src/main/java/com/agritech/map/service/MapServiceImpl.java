package com.agritech.map.service;

import com.agritech.common.exception.ResourceNotFoundException;
import com.agritech.map.dto.MapRequestDto;
import com.agritech.map.dto.MapResponseDto;
import com.agritech.map.model.LayerType;
import com.agritech.map.model.MapLayer;
import com.agritech.map.repository.MapRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MapServiceImpl implements MapService {

    private final MapRepository mapRepository;

    @Override
    public MapResponseDto create(MapRequestDto requestDto) {
        MapLayer layer = MapLayer.builder()
                .fieldId(requestDto.getFieldId())
                .layerType(requestDto.getLayerType())
                .layerName(requestDto.getLayerName())
                .dataUrl(requestDto.getDataUrl())
                .geoJsonData(requestDto.getGeoJsonData())
                .captureDate(requestDto.getCaptureDate())
                .build();

        MapLayer saved = mapRepository.save(layer);
        return toDto(saved);
    }

    @Override
    public List<MapResponseDto> getByField(Long fieldId) {
        return mapRepository.findByFieldId(fieldId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MapResponseDto> getByFieldAndType(Long fieldId, LayerType layerType) {
        return mapRepository.findByFieldIdAndLayerType(fieldId, layerType)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Long id) {
        if (!mapRepository.existsById(id)) {
            throw new ResourceNotFoundException("MapLayer", "id", id);
        }
        mapRepository.deleteById(id);
    }

    private MapResponseDto toDto(MapLayer layer) {
        return MapResponseDto.builder()
                .id(layer.getId())
                .fieldId(layer.getFieldId())
                .layerType(layer.getLayerType())
                .layerName(layer.getLayerName())
                .dataUrl(layer.getDataUrl())
                .geoJsonData(layer.getGeoJsonData())
                .captureDate(layer.getCaptureDate())
                .createdAt(layer.getCreatedAt())
                .build();
    }
}

