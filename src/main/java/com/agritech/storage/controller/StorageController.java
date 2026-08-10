package com.agritech.storage.controller;

import com.agritech.storage.dto.StorageResponseDto;
import com.agritech.storage.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/storage")
@RequiredArgsConstructor
public class StorageController {

    private final StorageService storageService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<StorageResponseDto> upload(@RequestParam("file") MultipartFile file,
                                                     @RequestParam(value = "folder", defaultValue = "uploads") String folder) {
        return ResponseEntity.status(HttpStatus.CREATED).body(storageService.upload(file, folder));
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> download(@RequestParam String key) {
        byte[] data = storageService.download(key);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + key.substring(key.lastIndexOf('/') + 1) + "\"")
                .body(data);
    }

    @DeleteMapping
    public ResponseEntity<Void> delete(@RequestParam String key) {
        storageService.delete(key);
        return ResponseEntity.noContent().build();
    }
}