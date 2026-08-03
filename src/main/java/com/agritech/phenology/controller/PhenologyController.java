package com.agritech.phenology.controller;

import com.agritech.phenology.dto.PhenologyRequestDto;
import com.agritech.phenology.dto.PhenologyResponseDto;
import com.agritech.phenology.service.PhenologyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/phenology")
@RequiredArgsConstructor
public class PhenologyController {

    private final PhenologyService phenologyService;

    @PostMapping
    public ResponseEntity<PhenologyResponseDto> create(@Valid @RequestBody PhenologyRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(phenologyService.create(requestDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhenologyResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(phenologyService.getById(id));
    }

    @GetMapping("/field/{fieldId}")
    public ResponseEntity<List<PhenologyResponseDto>> getByField(@PathVariable Long fieldId) {
        return ResponseEntity.ok(phenologyService.getByField(fieldId));
    }

    @GetMapping("/field/{fieldId}/latest")
    public ResponseEntity<PhenologyResponseDto> getLatestByField(@PathVariable Long fieldId) {
        return ResponseEntity.ok(phenologyService.getLatestByField(fieldId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        phenologyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}