package com.agritech.weather.controller;

import com.agritech.weather.dto.WeatherRequestDto;
import com.agritech.weather.dto.WeatherResponseDto;
import com.agritech.weather.service.WeatherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;

    @PostMapping
    public ResponseEntity<WeatherResponseDto> create(@Valid @RequestBody WeatherRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(weatherService.create(requestDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WeatherResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(weatherService.getById(id));
    }

    @GetMapping("/field/{fieldId}")
    public ResponseEntity<List<WeatherResponseDto>> getByField(@PathVariable Long fieldId) {
        return ResponseEntity.ok(weatherService.getByField(fieldId));
    }

    @GetMapping("/field/{fieldId}/latest")
    public ResponseEntity<WeatherResponseDto> getLatestByField(@PathVariable Long fieldId) {
        return ResponseEntity.ok(weatherService.getLatestByField(fieldId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        weatherService.delete(id);
        return ResponseEntity.noContent().build();
    }
}