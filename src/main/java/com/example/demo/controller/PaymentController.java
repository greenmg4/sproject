package com.example.demo.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
//[박민혁]
@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final String iamportApiKey = "4781582502016840";
    private final String iamportApiSecret = "6FDmkuKo0lCTpVWBt3oXd3Mxo5W8f6UQILzocEQrWqSwQ2dmeECflw18dT3rcBwp7KH4vyxKgTxz6Ohx";

    private String getAccessToken() throws Exception {
        RestTemplate restTemplate = new RestTemplate();

        String url = "https://api.iamport.kr/users/getToken";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String body = String.format("{\"imp_key\":\"%s\", \"imp_secret\":\"%s\"}", iamportApiKey, iamportApiSecret);

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            return root.path("response").path("access_token").asText();
        } else {
            throw new RuntimeException("아임포트 토큰 발급 실패");
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> params) throws Exception {
        String imp_uid = params.get("imp_uid");
        if (imp_uid == null || imp_uid.isEmpty()) {
            return ResponseEntity.badRequest().body("imp_uid가 없습니다.");
        }

        String accessToken = getAccessToken();

        RestTemplate restTemplate = new RestTemplate();
        String url = "https://api.iamport.kr/payments/" + imp_uid;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            JsonNode payment = root.path("response");

            String status = payment.path("status").asText();
            int amount = payment.path("amount").asInt();

            // TODO: 실제 주문 금액과 비교 검증 필수!

            if ("paid".equals(status)) {
                // 결제 성공 처리 (DB 저장 등)
                return ResponseEntity.ok(Map.of("status", "paid"));
            } else {
                return ResponseEntity.ok(Map.of("status", "failed"));
            }
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("아임포트 결제 조회 실패");
        }
    }
}

