package com.example.demo.controller;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.UserInfoDTO;
import com.example.demo.service.UserInfoService;

@RestController
@RequestMapping("/api/user")
public class UserInfoController {

    @Autowired
    private UserInfoService userInfoService;

    @PostMapping("/info")
    public UserInfoDTO getUserInfo(@RequestBody Map<String, String> map) {
        String cust_Id = map.get("cust_id");
        return userInfoService.getUserInfoById(cust_Id);
    }
    
    //프로필 이미지 업로드
    @PostMapping("/upload-profile")
    public UserInfoDTO uploadProfileImage(@RequestParam("file") MultipartFile file,
                                          @RequestParam("cust_id") String custId) throws IOException {
        try {
            System.out.println("🔥 업로드 요청 수신됨");

            // 1. 먼저 기존 이미지 경로 가져오기 (DB 수정 전에!)
            String oldImgUrl = userInfoService.getUserInfoById(custId).getProfile_img();
            if (oldImgUrl != null && oldImgUrl.startsWith("/images/profile/")) {
                String oldFileName = oldImgUrl.replace("/images/profile/", "");
                File oldFile = new File("C:/MTest/gitWorkspace/sproject/front/react/public/images/profile/" + oldFileName);
                if (oldFile.exists()) {
                    boolean deleted = oldFile.delete();
                    System.out.println("🧹 기존 파일 삭제됨: " + deleted);
                }
            }

            // 2. 새 파일 저장
            String uploadPath = "C:/MTest/gitWorkspace/sproject/front/react/public/images/profile";
            File dir = new File(uploadPath);
            if (!dir.exists()) dir.mkdirs();

            String filename = custId + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File dest = new File(uploadPath + "/" + filename);
            file.transferTo(dest);
            String imgUrl = "/images/profile/" + filename;

            // 3. DB 업데이트 (이제 새 이미지로!)
            userInfoService.updateProfileImg(custId, imgUrl);

            return userInfoService.getUserInfoById(custId);

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    

    // 프로필 이미지 삭제 (DB + 실제 파일 삭제)
    @PostMapping("/delete-profile")
    public String deleteProfileImage(@RequestBody Map<String, String> map) {
        String custId = map.get("cust_id");

        // 1. DB에서 이미지 경로 가져오기
        String imgUrl = userInfoService.getUserInfoById(custId).getProfile_img();
        if (imgUrl != null && imgUrl.startsWith("/images/profile/")) {
            String filename = imgUrl.replace("/images/profile/", "");
            File file = new File("C:/MTest/gitWorkspace/sproject/front/react/public/images/profile/" + filename);
            if (file.exists()) {
                file.delete();
                System.out.println("🗑️ 실제 파일 삭제됨: " + filename);
            }
        }

        // 2. DB에서 경로 제거
        userInfoService.deleteProfileImg(custId);
        return "deleted";
    }
    
}