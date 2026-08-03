package com.agritech.storage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StorageResponseDto {

    private String key;       // S3 object key
    private String url;       // publicly resolvable URL (or presigned, depending on bucket policy)
    private long sizeBytes;
    private String contentType;
}