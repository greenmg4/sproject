package com.example.demo.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ChatMessageDTO {
	private int qna_no;
    private int seq;
    private int qna_class;
    private int qna_type;
    private String cust_id;
    private String content;
    private LocalDateTime qna_dtm;
    private String lastMessage;
    private String grade;
}
