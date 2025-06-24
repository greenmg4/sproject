package com.example.demo.controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.ChatMessageDTO;
import com.example.demo.model.CustDTO;
import com.example.demo.service.ChatService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService service;
    private final SimpMessagingTemplate template;

    @MessageMapping("/chat/message")
    public void handle(ChatMessageDTO dto){

        dto.setQna_dtm(LocalDateTime.now());

        /* ① room_create_id가 비어있으면 서비스에서 찾아서 채워줌 */
        if (dto.getRoom_create_id() == null) {
            String creator = service.findRoomCreator(dto.getQna_no());
            dto.setRoom_create_id(creator);
        }

        service.insertMessage(dto);
        
        dto.setCust_nm( service.findCustName(dto.getCust_id()) );

        /* ② 진행·종료 상태값 유지 */
        if(dto.getQna_type() == 1){
            service.updateRoomType(dto.getQna_no(), 1);
        }else if(dto.getQna_type() == 2){
            service.updateRoomType(dto.getQna_no(), 2);
        }

        /* ③ 실시간 브로드캐스트 */
        template.convertAndSend("/sub/chat/room/"+dto.getQna_no(), dto);
        template.convertAndSend("/sub/chat/summary", dto);
    }

    @GetMapping("/history/{qna_no}")
    public List<ChatMessageDTO> history(@PathVariable int qna_no){
        return service.getMessagesByRoomId(qna_no);
    }

    @GetMapping("/rooms")
    public List<ChatMessageDTO> rooms(){
        return service.getRoomSummaries(2);  // 종료 방 제외
    }

    @GetMapping("/userinfo")
    public ResponseEntity<CustDTO> info(HttpSession session){
        String id = (String)session.getAttribute("loginID");
        String grade = (String)session.getAttribute("grade");
        if(id == null) return ResponseEntity.status(401).build();
        CustDTO dto = new CustDTO();
        dto.setCust_id(id);
        dto.setGrade(grade);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/create")
    public Map<String,Integer> create(Principal p){
        String user = p != null ? p.getName() : "guest";
        int qnaNo = service.createRoomForUser(user);
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setQna_no(qnaNo);
        dto.setCust_id("system");
        dto.setRoom_create_id(user);
        dto.setGrade("C");
        dto.setContent("어떤 것을 도와드릴까요?");
        dto.setQna_type(0);
        template.convertAndSend("/sub/chat/summary", dto);
        return Map.of("qna_no", qnaNo);
    }
    
    @GetMapping("/mychats")
    public List<ChatMessageDTO> getMyChatList(HttpSession session) {
        String session_id = (String) session.getAttribute("loginID");
        return service.getUserChatList(session_id);
    }
    
    @GetMapping("/search")
    public List<ChatMessageDTO> getClosedRoomsByCustId(@RequestParam String custId) {
        return service.getClosedRoomsByCustId(custId);
    }
    
}
