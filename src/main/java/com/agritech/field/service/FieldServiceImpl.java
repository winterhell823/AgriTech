package com.agritech.field.service;

import com.agritech.common.exception.ResourceNotFoundException;
import com.agritech.common.util.GeoJsonUtil;
import com.agritech.field.dto.FieldRequestDto;
import com.agritech.field.dto.FieldResponseDto;
import com.agritech.field.model.Field;
import com.agritech.field.repository.FieldRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Polygon;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FieldServiceImpl implements FieldService {

    private final FieldRepository fieldRepository;

    @Override
    public FieldResponseDto create(FieldRequestDto requestDto) {
        Polygon boundary = (Polygon) GeoJsonUtil.fromGeoJson(requestDto.getBoundaryGeoJson());

        Field field = Field.builder()
                .ownerId(requestDto.getOwnerId())
                .name(requestDto.getName())
                .areaHectares(requestDto.getAreaHectares())
                .boundary(boundary)
                .build();

        Field saved = fieldRepository.save(field);
        return toDto(saved);
    }

    @Override
    public FieldResponseDto getById(Long id) {
        Field field = fieldRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Field", "id", id));
        return toDto(field);
    }

    @Override
    public List<FieldResponseDto> getAll() {
        return fieldRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FieldResponseDto> getByOwner(Long ownerId) {
        return fieldRepository.findByOwnerId(ownerId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public FieldResponseDto update(Long id, FieldRequestDto requestDto) {
        Field field = fieldRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Field", "id", id));

        field.setName(requestDto.getName());
        field.setAreaHectares(requestDto.getAreaHectares());
        field.setBoundary((Polygon) GeoJsonUtil.fromGeoJson(requestDto.getBoundaryGeoJson()));

        Field updated = fieldRepository.save(field);
        return toDto(updated);
    }

    @Override
    public void delete(Long id) {
        if (!fieldRepository.existsById(id)) {
            throw new ResourceNotFoundException("Field", "id", id);
        }
        fieldRepository.deleteById(id);
    }

    private FieldResponseDto toDto(Field field) {
        return FieldResponseDto.builder()
                .id(field.getId())
                .ownerId(field.getOwnerId())
                .name(field.getName())
                .areaHectares(field.getAreaHectares())
                .boundaryGeoJson(GeoJsonUtil.toGeoJson(field.getBoundary()))
                .createdAt(field.getCreatedAt())
                .updatedAt(field.getUpdatedAt())
                .build();
    }
}