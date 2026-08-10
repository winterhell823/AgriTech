package com.agritech.stress.service;

import com.agritech.stress.dto.StressRequestDto;
import com.agritech.stress.dto.StressResponseDto;

import java.util.List;

public interface StressService {

    StressResponseDto create(StressRequestDto requestDto);

    StressResponseDto getById(Long id);

    List<StressResponseDto> getByField(Long fieldId);

    StressResponseDto getLatestByField(Long fieldId);

    void delete(Long id);
}