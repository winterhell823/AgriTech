package com.agritech.phenology.service;

import com.agritech.phenology.dto.PhenologyRequestDto;
import com.agritech.phenology.dto.PhenologyResponseDto;

import java.util.List;

public interface PhenologyService {

    PhenologyResponseDto create(PhenologyRequestDto requestDto);

    PhenologyResponseDto getById(Long id);

    List<PhenologyResponseDto> getByField(Long fieldId);

    PhenologyResponseDto getLatestByField(Long fieldId);

    void delete(Long id);
}