package com.agritech.crop.service;

import com.agritech.common.exception.ResourceNotFoundException;
import com.agritech.crop.dto.CropRequestDto;
import com.agritech.crop.dto.CropResponseDto;
import com.agritech.crop.model.Crop;
import com.agritech.crop.repository.CropRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CropServiceImpl implements CropService {

    private final CropRepository cropRepository;

    @Override
    public CropResponseDto create(CropRequestDto requestDto) {
        Crop crop = Crop.builder()
                .fieldId(requestDto.getFieldId())
                .cropType(requestDto.getCropType())
                .confidenceScore(requestDto.getConfidenceScore())
                .satelliteSceneId(requestDto.getSatelliteSceneId())
                .classificationDate(requestDto.getClassificationDate())
                .build();

        Crop saved = cropRepository.save(crop);
        return toDto(saved);
    }

    @Override
    public CropResponseDto getById(Long id) {
        Crop crop = cropRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crop", "id", id));
        return toDto(crop);
    }

    @Override
    public List<CropResponseDto> getByField(Long fieldId) {
        return cropRepository.findByFieldIdOrderByClassificationDateDesc(fieldId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CropResponseDto getLatestByField(Long fieldId) {
        Crop crop = cropRepository.findTopByFieldIdOrderByClassificationDateDesc(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Crop", "fieldId", fieldId));
        return toDto(crop);
    }

    @Override
    public void delete(Long id) {
        if (!cropRepository.existsById(id)) {
            throw new ResourceNotFoundException("Crop", "id", id);
        }
        cropRepository.deleteById(id);
    }

    private CropResponseDto toDto(Crop crop) {
        return CropResponseDto.builder()
                .id(crop.getId())
                .fieldId(crop.getFieldId())
                .cropType(crop.getCropType())
                .confidenceScore(crop.getConfidenceScore())
                .satelliteSceneId(crop.getSatelliteSceneId())
                .classificationDate(crop.getClassificationDate())
                .createdAt(crop.getCreatedAt())
                .build();
    }
}