package com.agritech.chat.service;

import com.agritech.chat.dto.ChatRequestDto;
import com.agritech.chat.dto.ChatResponseDto;
import com.agritech.chat.model.Chat;
import com.agritech.chat.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;
    private final RestTemplate restTemplate;

    @Value("${ai-service.base-url:${ai-service.url:http://localhost:8000/api/v1}}")
    private String aiServiceBaseUrl;

    @Override
    public ChatResponseDto sendMessage(ChatRequestDto requestDto) {
        // Forward the question to the Python AI service's RAG chatbot endpoint
        Map<String, Object> payload = Map.of(
                "session_id", requestDto.getSessionId(),
                "field_id", requestDto.getFieldId(),
                "message", requestDto.getMessage()
        );

        Map<String, Object> aiResponse = restTemplate.postForObject(
                aiServiceBaseUrl + "/api/chat", payload, Map.class);

        String botReply = aiResponse != null
                ? String.valueOf(aiResponse.getOrDefault("response", ""))
                : "";

        Chat chat = Chat.builder()
                .sessionId(requestDto.getSessionId())
                .fieldId(requestDto.getFieldId())
                .userMessage(requestDto.getMessage())
                .botResponse(botReply)
                .build();

        Chat saved = chatRepository.save(chat);
        return toDto(saved);
    }

    @Override
    public List<ChatResponseDto> getHistoryBySession(String sessionId) {
        return chatRepository.findBySessionIdOrderByCreatedAtAsc(sessionId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ChatResponseDto> getHistoryByField(String fieldId) {
        return chatRepository.findByFieldIdOrderByCreatedAtDesc(fieldId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private ChatResponseDto toDto(Chat chat) {
        return ChatResponseDto.builder()
                .id(chat.getId())
                .sessionId(chat.getSessionId())
                .fieldId(chat.getFieldId())
                .userMessage(chat.getUserMessage())
                .botResponse(chat.getBotResponse())
                .createdAt(chat.getCreatedAt())
                .build();
    }
}