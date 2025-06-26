package com.example.demo.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.NoticeDTO;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import mapperInterface.NoticeMapper;

@Service
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService {

    private final NoticeMapper mapper;
    private final String uploadDir = System.getProperty("user.dir") +
            "/front/react/public/images/notice/";

    @PostConstruct
    private void init() throws IOException {
        Files.createDirectories(Paths.get(uploadDir));
    }

    @Override
    public List<NoticeDTO> list() {
        return mapper.selectAll();
    }

    @Override
    public NoticeDTO active() {
        return mapper.selectActive();
    }

    @Override
    public NoticeDTO upload(MultipartFile file, String notiClass) throws IOException {
        String uuid = file.getOriginalFilename();
        Path target = Paths.get(uploadDir, uuid);
        file.transferTo(target);

        NoticeDTO dto = new NoticeDTO();
        dto.setImg_path("images/notice/" + uuid);
        dto.setNoti_class(notiClass);
        dto.setNoti_yn("N");
        dto.setReg_dt(LocalDateTime.now());
        mapper.insert(dto);
        return dto;
    }

    @Override
    public int toggle(int noticeNo, String yn) {
        if ("Y".equals(yn)) {
            mapper.selectAll().stream()
                  .filter(n -> "Y".equals(n.getNoti_yn()))
                  .forEach(n -> mapper.updateYn(n.getNotice_no(), "N"));
        }
        return mapper.updateYn(noticeNo, yn);
    }

    @Override
    public int remove(int noticeNo) throws IOException {
        NoticeDTO dto = mapper.selectAll().stream()
                .filter(n -> n.getNotice_no() == noticeNo)
                .findFirst().orElse(null);
        if (dto != null) {
            Path p = Paths.get(System.getProperty("user.dir"),
                    "front/react/public", dto.getImg_path());
            Files.deleteIfExists(p);
        }
        return mapper.delete(noticeNo);
    }
}