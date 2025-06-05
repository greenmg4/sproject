package com.example.demo.service;

import java.util.List;
import com.example.demo.model.ChatMessageDTO;

public interface ChatService {
    int selectMaxSeq(int qna_no);
    void insertMessage(ChatMessageDTO dto);
    List<ChatMessageDTO> getMessagesByRoomId(int qna_no);
    List<ChatMessageDTO> getRoomSummaries(int excludeType);
    int generateNewQnaNo();
    int createRoomForUser(String userCustId);
    void updateRoomType(int qna_no, int qna_type);
    List<ChatMessageDTO> getUserChatList(String session_id);
}
