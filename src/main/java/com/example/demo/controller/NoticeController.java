package com.example.demo.controller;


import com.example.demo.model.NoticeDTO;
import com.example.demo.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notice")
public class NoticeController {

    private final NoticeService service;

    @GetMapping
    public List<NoticeDTO> list() {
        return service.list();
    }

    @GetMapping("/active")
    public NoticeDTO active() {
        return service.active();
    }

    @PostMapping("/upload")
    public NoticeDTO upload(@RequestPart MultipartFile file,
                            @RequestPart String notiClass) throws IOException {
        return service.upload(file, notiClass);
    }

    @PatchMapping("/{noticeNo}")
    public int toggle(@PathVariable int noticeNo,
                      @RequestParam String yn) {
        return service.toggle(noticeNo, yn);
    }

    @DeleteMapping("/{noticeNo}")
    public int delete(@PathVariable int noticeNo) throws IOException {
        return service.remove(noticeNo);
    }
}

