package com.example.demo.service;

import java.util.List;

import com.example.demo.domain.ChatMessageDTO;
import com.example.demo.domain.CustomDTO;

public interface ChatService {
    void saveMessage(ChatMessageDTO message);
    List<ChatMessageDTO> getMessageHistory(Long roomId);
    List<ChatMessageDTO> getRoomSummaries();
    CustomDTO getUserInfo(String custId);
}
