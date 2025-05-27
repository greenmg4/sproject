package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.ChatMessageDTO;
import com.example.demo.model.CustDTO;

import lombok.RequiredArgsConstructor;
import mapperInterface.ChatMessageMapper;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageMapper chatMessageMapper;

    @Override
    @Transactional
    public void saveMessage(ChatMessageDTO message) {
        int maxSeq = chatMessageMapper.selectMaxSeq(message.getRoomId());
        message.setSeq(maxSeq + 1);
        chatMessageMapper.insertMessage(message);
    }

    @Override
    public List<ChatMessageDTO> getMessageHistory(Long roomId) {
        return chatMessageMapper.getMessagesByRoomId(roomId);
    }
    
    @Override
    public List<ChatMessageDTO> getRoomSummaries() {
    	return chatMessageMapper.getRoomSummaries();
    }
    
    @Override
    public CustDTO getUserInfo(String custId) {
        return chatMessageMapper.getUserInfo(custId);
    }
    
}
