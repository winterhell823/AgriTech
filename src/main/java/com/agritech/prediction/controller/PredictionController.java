package com.agritech.prediction.controller;

import com.agritech.prediction.dto.PredictionRequestDto;
import com.agritech.prediction.dto.PredictionResponseDto;
import com.agritech.prediction.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<PredictionResponseDto> processPrediction(@RequestBody PredictionRequestDto requestDto) {
        return ResponseEntity.ok(predictionService.processPrediction(requestDto));
    }
}
