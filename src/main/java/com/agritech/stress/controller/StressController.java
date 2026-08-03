package com.agritech.stress.controller;

import com.agritech.stress.dto.StressRequestDto;
import com.agritech.stress.dto.StressResponseDto;
import com.agritech.stress.service.StressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stress")
@RequiredArgsConstructor
public class StressController {

    private final StressService stressService;

    @PostMapping
    public ResponseEntity<StressResponseDto> create(@Valid @RequestBody StressRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(stressService.create(requestDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StressResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(stressService.getById(id));
    }

    @GetMapping("/field/{fieldId}")
    public ResponseEntity<List<StressResponseDto>> getByField(@PathVariable Long fieldId) {
        return ResponseEntity.ok(stressService.getByField(fieldId));
    }

    @GetMapping("/field/{fieldId}/latest")
    public ResponseEntity<StressResponseDto> getLatestByField(@PathVariable Long fieldId) {
        return ResponseEntity.ok(stressService.getLatestByField(fieldId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        stressService.delete(id);
        return ResponseEntity.noContent().build();
    }
}