package com.example.demo.service;

import java.util.List;

import com.example.demo.model.ChatMessageDTO;
import com.example.demo.model.CustDTO;

public interface ChatService {
    void saveMessage(ChatMessageDTO message);
    List<ChatMessageDTO> getMessageHistory(Long roomId);
    List<ChatMessageDTO> getRoomSummaries();
    CustDTO getUserInfo(String custId);
}
