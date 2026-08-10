package com.agritech.chat.repository;

import com.agritech.chat.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    List<Chat> findBySessionIdOrderByCreatedAtAsc(String sessionId);

    List<Chat> findByFieldIdOrderByCreatedAtDesc(String fieldId);
}