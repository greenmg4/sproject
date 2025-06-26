package com.example.demo.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NoticeDTO {
    private Integer notice_no;   // 공지 PK
    private String  img_path;    // 이미지 경로
    private String  noti_yn;     // 노출 여부 (Y/N)
    private String  noti_class;  // 01: 이벤트, 02: 안내
    private LocalDateTime reg_dt;// 등록 일시
}