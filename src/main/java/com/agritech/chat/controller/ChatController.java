package com.agritech.chat.controller;

import com.agritech.chat.dto.ChatRequestDto;
import com.agritech.chat.dto.ChatResponseDto;
import com.agritech.chat.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponseDto> sendMessage(@Valid @RequestBody ChatRequestDto requestDto) {
        return ResponseEntity.ok(chatService.sendMessage(requestDto));
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<ChatResponseDto>> getBySession(@PathVariable String sessionId) {
        return ResponseEntity.ok(chatService.getHistoryBySession(sessionId));
    }

    @GetMapping("/field/{fieldId}")
    public ResponseEntity<List<ChatResponseDto>> getByField(@PathVariable String fieldId) {
        return ResponseEntity.ok(chatService.getHistoryByField(fieldId));
    }
}