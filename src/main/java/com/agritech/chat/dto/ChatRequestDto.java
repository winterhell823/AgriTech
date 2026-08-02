package com.agritech.chat.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequestDto {

    @NotBlank(message = "sessionId is required")
    private String sessionId;

    private Long fieldId;

    @NotBlank(message = "message cannot be empty")
    private String message;
}