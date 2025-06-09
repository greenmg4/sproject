package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.ChatMessageDTO;

import lombok.RequiredArgsConstructor;
import mapperInterface.ChatMessageMapper;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageMapper mapper;

    @Override public int selectMaxSeq(int qna_no){return mapper.selectMaxSeq(qna_no);}

    @Override @Transactional
    public void insertMessage(ChatMessageDTO dto){
        int seq = mapper.selectMaxSeq(dto.getQna_no()) + 1;
        dto.setSeq(seq);
        mapper.insertMessage(dto);
    }

    @Override public List<ChatMessageDTO> getMessagesByRoomId(int qna_no){
        return mapper.getMessagesByRoomId(qna_no);
    }

    @Override public List<ChatMessageDTO> getRoomSummaries(int excludeType){
        return mapper.getRoomSummaries(excludeType);
    }

    @Override public int generateNewQnaNo(){return mapper.selectNextQnaNo();}

    @Override @Transactional
    public int createRoomForUser(String userCustId){
        int qnaNo = generateNewQnaNo();
        /* 첫 시스템 메시지 */
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setQna_no(qnaNo);
        dto.setSeq(1);
        dto.setQna_class(0);
        dto.setQna_type(0);
        dto.setCust_id("system");
        dto.setGrade("C");
        dto.setContent("어떤 것을 도와드릴까요?");
        dto.setQna_dtm(LocalDateTime.now());
        mapper.insertMessage(dto);
        return qnaNo;
    }

    @Override @Transactional
    public void updateRoomType(int qna_no, int qna_type){
        mapper.updateRoomType(qna_no, qna_type);
    }
    
    @Override
    public List<ChatMessageDTO> getUserChatList(String session_id) {
        return mapper.getUserChatList(session_id);
    }
}
