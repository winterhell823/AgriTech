package com.agritech.storage.service;

import com.agritech.storage.dto.StorageResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

public interface StorageService {

    StorageResponseDto upload(MultipartFile file, String folder);

    StorageResponseDto upload(InputStream inputStream, String key, String contentType, long contentLength);

    byte[] download(String key);

    void delete(String key);

    String getPublicUrl(String key);
}