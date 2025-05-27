package com.example.demo.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ChatMessageDTO {
    private Long id;
    private Long roomId;
    private String sender;
    private String message;
    private LocalDateTime createdAt;
    private String lastMessage;
    private String grade;
    private int seq;
    private int qnaclass;
    private int qnatype;
}
