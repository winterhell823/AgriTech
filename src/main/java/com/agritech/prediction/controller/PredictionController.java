package com.agritech.prediction.controller;

import com.agritech.prediction.dto.PredictionRequestDto;
import com.agritech.prediction.dto.PredictionResponseDto;
import com.agritech.prediction.service.PredictionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/predictions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PredictionController {

    private final PredictionService predictionService;

    @PostMapping("/field/{fieldId}")
    public ResponseEntity<PredictionResponseDto> getPredictionForField(@PathVariable String fieldId) {
        return ResponseEntity.ok(predictionService.getPredictionForField(fieldId));
    }

    @PostMapping
    public ResponseEntity<PredictionResponseDto> processPrediction(@Valid @RequestBody PredictionRequestDto requestDto) {
        return ResponseEntity.ok(predictionService.processPrediction(requestDto));
    }

    @PostMapping("/run")
    public ResponseEntity<PredictionResponseDto> run(@Valid @RequestBody PredictionRequestDto requestDto) {
        return ResponseEntity.ok(predictionService.processPrediction(requestDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PredictionResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(predictionService.getById(id));
    }

    @GetMapping("/field/{fieldId}")
    public ResponseEntity<List<PredictionResponseDto>> getByField(@PathVariable String fieldId) {
        return ResponseEntity.ok(predictionService.getByField(fieldId));
    }
}
