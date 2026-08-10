package com.agritech.weather.service;

import com.agritech.common.exception.ResourceNotFoundException;
import com.agritech.weather.dto.WeatherRequestDto;
import com.agritech.weather.dto.WeatherResponseDto;
import com.agritech.weather.model.Weather;
import com.agritech.weather.repository.WeatherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WeatherServiceImpl implements WeatherService {

    private final WeatherRepository weatherRepository;

    @Override
    public WeatherResponseDto create(WeatherRequestDto requestDto) {
        Weather weather = Weather.builder()
                .fieldId(requestDto.getFieldId())
                .temperatureCelsius(requestDto.getTemperatureCelsius())
                .humidityPct(requestDto.getHumidityPct())
                .rainfallMm(requestDto.getRainfallMm())
                .windSpeedKmh(requestDto.getWindSpeedKmh())
                .source(requestDto.getSource())
                .recordedAt(requestDto.getRecordedAt())
                .build();

        Weather saved = weatherRepository.save(weather);
        return toDto(saved);
    }

    @Override
    public WeatherResponseDto getById(Long id) {
        Weather weather = weatherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Weather", "id", id));
        return toDto(weather);
    }

    @Override
    public List<WeatherResponseDto> getByField(Long fieldId) {
        return weatherRepository.findByFieldIdOrderByRecordedAtDesc(fieldId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public WeatherResponseDto getLatestByField(Long fieldId) {
        Weather weather = weatherRepository.findTopByFieldIdOrderByRecordedAtDesc(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException("Weather", "fieldId", fieldId));
        return toDto(weather);
    }

    @Override
    public void delete(Long id) {
        if (!weatherRepository.existsById(id)) {
            throw new ResourceNotFoundException("Weather", "id", id);
        }
        weatherRepository.deleteById(id);
    }

    private WeatherResponseDto toDto(Weather weather) {
        return WeatherResponseDto.builder()
                .id(weather.getId())
                .fieldId(weather.getFieldId())
                .temperatureCelsius(weather.getTemperatureCelsius())
                .humidityPct(weather.getHumidityPct())
                .rainfallMm(weather.getRainfallMm())
                .windSpeedKmh(weather.getWindSpeedKmh())
                .source(weather.getSource())
                .recordedAt(weather.getRecordedAt())
                .createdAt(weather.getCreatedAt())
                .build();
    }
}