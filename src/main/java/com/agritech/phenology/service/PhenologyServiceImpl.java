package com.agritech.phenology.service;

import com.agritech.common.exception.ResourceNotFoundException;
import com.agritech.phenology.dto.PhenologyRequestDto;
import com.agritech.phenology.dto.PhenologyResponseDto;
import com.agritech.phenology.model.Phenology;
import com.agritech.phenology.repository.PhenologyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhenologyServiceImpl implements PhenologyService {

    private final PhenologyRepository phenologyRepository;

    @Override
    public PhenologyResponseDto create(PhenologyRequestDto requestDto) {
        Phenology phenology = Phenology.builder()
                .fieldId(requestDto.getFieldId())
                .growthStage(requestDto.getGrowthStage())
                .confidenceScore(requestDto.getConfidenceScore())
                .satelliteSceneId(requestDto.getSatelliteSceneId())
                .observationDate(requestDto.getObservationDate())
                .build();

        Phenology saved = phenologyRepository.save(phenology);
        return toDto(saved);
    }

    @Override
    public PhenologyResponseDto getById(Long id) {
        Phenology phenology = phenologyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phenology", "id", id));
        return toDto(phenology);
    }

    @Override
    public List<PhenologyResponseDto> getByField(Long fieldId) {
        return phenologyRepository.findByFieldIdOrderByObservationDateDesc(fieldId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PhenologyResponseDto getLatestByField(Long fieldId) {
        Phenology phenology = phenologyRepository.findTopByFieldIdOrderByObservationDateDesc(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException("Phenology", "fieldId", fieldId));
        return toDto(phenology);
    }

    @Override
    public void delete(Long id) {
        if (!phenologyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Phenology", "id", id);
        }
        phenologyRepository.deleteById(id);
    }

    private PhenologyResponseDto toDto(Phenology phenology) {
        return PhenologyResponseDto.builder()
                .id(phenology.getId())
                .fieldId(phenology.getFieldId())
                .growthStage(phenology.getGrowthStage())
                .confidenceScore(phenology.getConfidenceScore())
                .satelliteSceneId(phenology.getSatelliteSceneId())
                .observationDate(phenology.getObservationDate())
                .createdAt(phenology.getCreatedAt())
                .build();
    }
}