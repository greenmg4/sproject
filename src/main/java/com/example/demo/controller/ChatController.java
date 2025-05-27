package com.example.demo.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.ChatMessageDTO;
import com.example.demo.model.CustDTO;
import com.example.demo.service.ChatService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    // WebSocket 메시지 수신 처리
    @MessageMapping("/chat/message")
    public void sendMessage(ChatMessageDTO content) {
    	content.setQna_dtm(LocalDateTime.now());
        chatService.insertMessage(content);  // service에 맞게 메서드명 변경

        // 채팅방별 실시간 메시지 전송
        messagingTemplate.convertAndSend("/sub/chat/room/" + content.getQna_no(), content);

        // 채팅 요약(마지막 메시지) 전송
        messagingTemplate.convertAndSend("/sub/chat/summary", content);
    }

    // 채팅 이력 조회 (특정 qna_no 기준)
    @GetMapping("/history/{qna_no}")
    public List<ChatMessageDTO> getHistory(@PathVariable int qna_no) {
        return chatService.getMessagesByRoomId(qna_no);
    }

    // 채팅방 목록 조회 (최근 메시지 요약용)
    @GetMapping("/rooms")
    public List<ChatMessageDTO> getActiveRooms() {
        return chatService.getRoomSummaries();
    }

    // 사용자 정보 조회
    @GetMapping("/userinfo")
    public ResponseEntity<CustDTO> getUserInfo(@RequestParam String cust_id) {
        CustDTO user = chatService.getUserInfo(cust_id);
        return ResponseEntity.ok(user);
    }
}
