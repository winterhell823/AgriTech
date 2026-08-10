package com.agritech.field.controller;

import com.agritech.field.dto.FieldRequestDto;
import com.agritech.field.dto.FieldResponseDto;
import com.agritech.field.service.FieldService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fields")
@RequiredArgsConstructor
public class FieldController {

    private final FieldService fieldService;

    @PostMapping
    public ResponseEntity<FieldResponseDto> create(@Valid @RequestBody FieldRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fieldService.create(requestDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FieldResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(fieldService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<FieldResponseDto>> getAll() {
        return ResponseEntity.ok(fieldService.getAll());
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<FieldResponseDto>> getByOwner(@PathVariable String ownerId) {
        return ResponseEntity.ok(fieldService.getByOwner(ownerId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FieldResponseDto> update(@PathVariable Long id,
                                                   @Valid @RequestBody FieldRequestDto requestDto) {
        return ResponseEntity.ok(fieldService.update(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        fieldService.delete(id);
        return ResponseEntity.noContent().build();
    }
}