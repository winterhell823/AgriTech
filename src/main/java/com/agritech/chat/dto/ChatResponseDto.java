package com.agritech.chat.dto;

import lombok.Getter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponseDto {

    private Long id;
    private String sessionId;
    private Long fieldId;
    private String userMessage;
    private String botResponse;
    private Instant createdAt;
}
