package com.agritech.crop.controller;

import com.agritech.crop.dto.CropRequestDto;
import com.agritech.crop.dto.CropResponseDto;
import com.agritech.crop.service.CropService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crops")
@RequiredArgsConstructor
public class CropController {

    private final CropService cropService;

    @PostMapping
    public ResponseEntity<CropResponseDto> create(@Valid @RequestBody CropRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cropService.create(requestDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CropResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(cropService.getById(id));
    }

    @GetMapping("/field/{fieldId}")
    public ResponseEntity<List<CropResponseDto>> getByField(@PathVariable Long fieldId) {
        return ResponseEntity.ok(cropService.getByField(fieldId));
    }

    @GetMapping("/field/{fieldId}/latest")
    public ResponseEntity<CropResponseDto> getLatestByField(@PathVariable Long fieldId) {
        return ResponseEntity.ok(cropService.getLatestByField(fieldId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        cropService.delete(id);
        return ResponseEntity.noContent().build();
    }
}