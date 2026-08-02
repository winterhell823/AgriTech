package com.agritech.chat.service;

import com.agritech.chat.dto.ChatRequestDto;
import com.agritech.chat.dto.ChatResponseDto;

import java.util.List;

public interface ChatService {

    ChatResponseDto sendMessage(ChatRequestDto requestDto);

    List<ChatResponseDto> getHistoryBySession(String sessionId);

    List<ChatResponseDto> getHistoryByField(Long fieldId);
}