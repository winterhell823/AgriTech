package com.agritech.crop.service;

import com.agritech.crop.dto.CropRequestDto;
import com.agritech.crop.dto.CropResponseDto;

import java.util.List;

public interface CropService {

    CropResponseDto create(CropRequestDto requestDto);

    CropResponseDto getById(Long id);

    List<CropResponseDto> getByField(Long fieldId);

    CropResponseDto getLatestByField(Long fieldId);

    void delete(Long id);
}