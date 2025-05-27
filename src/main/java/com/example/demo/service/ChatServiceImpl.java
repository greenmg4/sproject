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
    public int selectMaxSeq(int qna_no) {
        return chatMessageMapper.selectMaxSeq(qna_no);
    }

    @Override
    @Transactional
    public void insertMessage(ChatMessageDTO content) {
        int maxSeq = chatMessageMapper.selectMaxSeq(content.getQna_no());
        content.setSeq(maxSeq + 1);
        chatMessageMapper.insertMessage(content);
    }

    @Override
    public List<ChatMessageDTO> getMessagesByRoomId(int qna_no) {
        return chatMessageMapper.getMessagesByRoomId(qna_no);
    }

    @Override
    public List<ChatMessageDTO> getRoomSummaries() {
        return chatMessageMapper.getRoomSummaries();
    }

    @Override
    public CustDTO getUserInfo(String cust_Id) {
        return chatMessageMapper.getUserInfo(cust_Id);
    }
}
