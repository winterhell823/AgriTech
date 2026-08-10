package com.agritech.field.service;

import com.agritech.field.dto.FieldRequestDto;
import com.agritech.field.dto.FieldResponseDto;

import java.util.List;

public interface FieldService {

    FieldResponseDto create(FieldRequestDto requestDto);

    FieldResponseDto getById(Long id);

    List<FieldResponseDto> getAll();

    List<FieldResponseDto> getByOwner(String ownerId);

    FieldResponseDto update(Long id, FieldRequestDto requestDto);

    void delete(Long id);
}