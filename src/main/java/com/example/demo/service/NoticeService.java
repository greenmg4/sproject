package com.example.demo.service;

import com.example.demo.model.NoticeDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface NoticeService {
    List<NoticeDTO> list();
    NoticeDTO active();
    NoticeDTO upload(MultipartFile file, String notiClass) throws IOException;
    int toggle(int noticeNo, String yn);
    int remove(int noticeNo) throws IOException;
}