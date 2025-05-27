package com.example.demo.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.ChatMessageDTO;
import com.example.demo.model.CustDTO;
import com.example.demo.service.ChatService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService; // 인터페이스로 주입
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/message")
    public void sendMessage(ChatMessageDTO message) {
        message.setCreatedAt(LocalDateTime.now());
        chatService.saveMessage(message);
        messagingTemplate.convertAndSend("/sub/chat/room/" + message.getRoomId(), message);
        messagingTemplate.convertAndSend("/sub/chat/summary", message);
    }

    @GetMapping("/history/{roomId}")
    public List<ChatMessageDTO> getHistory(@PathVariable Long roomId) {
        return chatService.getMessageHistory(roomId);
    }
    
    @GetMapping("/rooms")
    public List<ChatMessageDTO> getActiveRoomIds() {
    	return chatService.getRoomSummaries();  // 메시지가 존재하는 방만 조회
    }
    
    @GetMapping("/userinfo")
    public ResponseEntity<CustDTO> getUserInfo(@RequestParam String custId) {
        CustDTO user = chatService.getUserInfo(custId);
        return ResponseEntity.ok(user);
    }
}