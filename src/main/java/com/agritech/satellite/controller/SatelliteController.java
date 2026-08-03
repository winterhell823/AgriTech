package com.agritech.satellite.controller;

import com.agritech.satellite.dto.SatelliteRequestDto;
import com.agritech.satellite.dto.SatelliteResponseDto;
import com.agritech.satellite.service.SatelliteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/satellite")
@RequiredArgsConstructor
public class SatelliteController {

    private final SatelliteService satelliteService;

    @PostMapping
    public ResponseEntity<SatelliteResponseDto> register(@Valid @RequestBody SatelliteRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(satelliteService.register(requestDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SatelliteResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(satelliteService.getById(id));
    }

    @GetMapping("/scene/{sceneId}")
    public ResponseEntity<SatelliteResponseDto> getBySceneId(@PathVariable String sceneId) {
        return ResponseEntity.ok(satelliteService.getBySceneId(sceneId));
    }

    @GetMapping("/field/{fieldId}")
    public ResponseEntity<List<SatelliteResponseDto>> getByField(@PathVariable Long fieldId) {
        return ResponseEntity.ok(satelliteService.getByField(fieldId));
    }

    @GetMapping("/field/{fieldId}/latest")
    public ResponseEntity<SatelliteResponseDto> getLatestByField(@PathVariable Long fieldId) {
        return ResponseEntity.ok(satelliteService.getLatestByField(fieldId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        satelliteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}