package com.agritech.satellite.service;

import com.agritech.common.exception.ResourceNotFoundException;
import com.agritech.satellite.dto.SatelliteRequestDto;
import com.agritech.satellite.dto.SatelliteResponseDto;
import com.agritech.satellite.model.Satellite;
import com.agritech.satellite.repository.SatelliteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SatelliteServiceImpl implements SatelliteService {

    private final SatelliteRepository satelliteRepository;

    @Override
    public SatelliteResponseDto register(SatelliteRequestDto requestDto) {
        Satellite satellite = Satellite.builder()
                .sceneId(requestDto.getSceneId())
                .source(requestDto.getSource())
                .fieldId(requestDto.getFieldId())
                .captureDate(requestDto.getCaptureDate())
                .cloudCoveragePct(requestDto.getCloudCoveragePct())
                .s3Url(requestDto.getS3Url())
                .build();

        Satellite saved = satelliteRepository.save(satellite);
        return toDto(saved);
    }

    @Override
    public SatelliteResponseDto getById(Long id) {
        Satellite satellite = satelliteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Satellite", "id", id));
        return toDto(satellite);
    }

    @Override
    public SatelliteResponseDto getBySceneId(String sceneId) {
        Satellite satellite = satelliteRepository.findBySceneId(sceneId)
                .orElseThrow(() -> new ResourceNotFoundException("Satellite", "sceneId", sceneId));
        return toDto(satellite);
    }

    @Override
    public List<SatelliteResponseDto> getByField(Long fieldId) {
        return satelliteRepository.findByFieldIdOrderByCaptureDateDesc(fieldId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public SatelliteResponseDto getLatestByField(Long fieldId) {
        Satellite satellite = satelliteRepository.findTopByFieldIdOrderByCaptureDateDesc(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException("Satellite", "fieldId", fieldId));
        return toDto(satellite);
    }

    @Override
    public void delete(Long id) {
        if (!satelliteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Satellite", "id", id);
        }
        satelliteRepository.deleteById(id);
    }

    private SatelliteResponseDto toDto(Satellite satellite) {
        return SatelliteResponseDto.builder()
                .id(satellite.getId())
                .sceneId(satellite.getSceneId())
                .source(satellite.getSource())
                .fieldId(satellite.getFieldId())
                .captureDate(satellite.getCaptureDate())
                .cloudCoveragePct(satellite.getCloudCoveragePct())
                .s3Url(satellite.getS3Url())
                .status(satellite.getStatus())
                .createdAt(satellite.getCreatedAt())
                .build();
    }
}