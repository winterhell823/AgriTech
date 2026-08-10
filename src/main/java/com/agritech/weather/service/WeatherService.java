package com.agritech.weather.service;

import com.agritech.weather.dto.WeatherRequestDto;
import com.agritech.weather.dto.WeatherResponseDto;

import java.util.List;

public interface WeatherService {

    WeatherResponseDto create(WeatherRequestDto requestDto);

    WeatherResponseDto getById(Long id);

    List<WeatherResponseDto> getByField(Long fieldId);

    WeatherResponseDto getLatestByField(Long fieldId);

    void delete(Long id);
}