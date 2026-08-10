package com.agritech.report.controller;

import com.agritech.report.dto.ReportRequestDto;
import com.agritech.report.dto.ReportResponseDto;
import com.agritech.report.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ReportResponseDto> requestReport(@Valid @RequestBody ReportRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reportService.requestReport(requestDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getById(id));
    }

    @GetMapping("/field/{fieldId}")
    public ResponseEntity<List<ReportResponseDto>> getByField(@PathVariable String fieldId) {
        return ResponseEntity.ok(reportService.getByField(fieldId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reportService.delete(id);
        return ResponseEntity.noContent().build();
    }
}