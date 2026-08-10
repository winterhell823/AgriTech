package com.agritech.stress.service;

import com.agritech.common.exception.ResourceNotFoundException;
import com.agritech.stress.dto.StressRequestDto;
import com.agritech.stress.dto.StressResponseDto;
import com.agritech.stress.model.Stress;
import com.agritech.stress.repository.StressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StressServiceImpl implements StressService {

    private final StressRepository stressRepository;

    @Override
    public StressResponseDto create(StressRequestDto requestDto) {
        Stress stress = Stress.builder()
                .fieldId(requestDto.getFieldId())
                .stressLevel(requestDto.getStressLevel())
                .confidenceScore(requestDto.getConfidenceScore())
                .moistureIndex(requestDto.getMoistureIndex())
                .satelliteSceneId(requestDto.getSatelliteSceneId())
                .observationDate(requestDto.getObservationDate())
                .build();

        Stress saved = stressRepository.save(stress);
        return toDto(saved);
    }

    @Override
    public StressResponseDto getById(Long id) {
        Stress stress = stressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stress", "id", id));
        return toDto(stress);
    }

    @Override
    public List<StressResponseDto> getByField(Long fieldId) {
        return stressRepository.findByFieldIdOrderByObservationDateDesc(fieldId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public StressResponseDto getLatestByField(Long fieldId) {
        Stress stress = stressRepository.findTopByFieldIdOrderByObservationDateDesc(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException("Stress", "fieldId", fieldId));
        return toDto(stress);
    }

    @Override
    public void delete(Long id) {
        if (!stressRepository.existsById(id)) {
            throw new ResourceNotFoundException("Stress", "id", id);
        }
        stressRepository.deleteById(id);
    }

    private StressResponseDto toDto(Stress stress) {
        return StressResponseDto.builder()
                .id(stress.getId())
                .fieldId(stress.getFieldId())
                .stressLevel(stress.getStressLevel())
                .confidenceScore(stress.getConfidenceScore())
                .moistureIndex(stress.getMoistureIndex())
                .satelliteSceneId(stress.getSatelliteSceneId())
                .observationDate(stress.getObservationDate())
                .createdAt(stress.getCreatedAt())
                .build();
    }
}