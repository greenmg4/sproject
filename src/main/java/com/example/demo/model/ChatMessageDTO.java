package com.example.demo.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ChatMessageDTO {
    private int qna_no;
    private int seq;
    private int qna_class;   // 0 시스템/기타, 1 상품, 2 배송
    private int qna_type;    // 0 시스템, 1 진행, 2 종료
    private String cust_id;
    private String content;
    private LocalDateTime qna_dtm;
    private String grade;    // 조인용
    private String room_create_id;
}
