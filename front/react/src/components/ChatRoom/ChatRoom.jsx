import React, { useEffect, useRef, useState } from "react"; // React 훅들 import
import SockJS from "sockjs-client"; // SockJS: 브라우저의 WebSocket을 안전하게 대체
import { Client } from "@stomp/stompjs"; // STOMP 클라이언트 라이브러리
import axios from "axios";
import "./ChatRoom.css";
import { useParams } from "react-router-dom";


const BASE_URL = "http://localhost:8080"; // 백엔드 Spring 서버 주소 (WebSocket 연결 대상)


const ChatRoom = () => {
  const { roomId } = useParams(); // ← 여기서 동적으로 방 번호 받아옴
  const [chatList, setChatList] = useState([]); // 채팅 메시지 목록 상태
  const [message, setMessage] = useState(""); // 현재 입력한 메시지 상태
  const stompClient = useRef(null); // STOMP 클라이언트 인스턴스를 저장할 ref
  const [sender, setSender] = useState(""); // sender 선언
  const [grade, setGrade] = useState(""); // grade 확인 선언



  // 컴포넌트가 마운트되면 WebSocket 연결
  useEffect(() => {
    // ✅ WebSocket 연결 설정
    const client = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
      connectHeaders: {},
      onConnect: () => {
        console.log("WebSocket 연결됨");

        // ✅ 실시간 메시지 수신 구독
        client.subscribe(`/sub/chat/room/${roomId}`, (res) => {
          const newMsg = JSON.parse(res.body);
          setChatList((prev) => [...prev, newMsg]);
        });
      },
      onStompError: (err) => {
        console.error("STOMP 에러:", err);
      },
    });

  client.activate();
  stompClient.current = client;

  // ✅ 새로고침 시 DB에서 기존 메시지 불러오기
  axios.get(`${BASE_URL}/chat/history/${roomId}`)
    .then((res) => {
      setChatList(res.data); // axios는 응답 본문이 res.data에 있음
    })
    .catch((err) => {
      console.error("채팅 내역 불러오기 실패:", err);
  });

  // 유저정보 받기
  axios.get(`${BASE_URL}/chat/userinfo`, {
    params: { custId: "user1234" }
  })
  .then((res) => {
    const { custId, grade } = res.data;
    setSender(custId);     // DB insert용 sender
    setGrade(grade);
  });

  return () => {
    client.deactivate();
  };
}, []);


  // 메시지 전송 함수
  const sendMessage = () => {
    if (!message.trim()) return; // 빈 문자열이면 전송 안 함

  // 보낼 메시지 객체
  const payload = {
    roomId: roomId,
    sender: sender, // 보내는 사람 이름
    message: message, // 전송할 메시지 내용
    grade: grade,
  };

  // 서버로 메시지 전송
  stompClient.current.publish({
    destination: "/pub/chat/message", // 백엔드에서 처리할 경로 (MessageMapping)
    body: JSON.stringify(payload), // 메시지를 JSON 문자열로 변환해서 보냄
  });

    setMessage(""); // 입력창 초기화
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2>채팅 상담{roomId}</h2>

      {/* 채팅 메시지 출력 영역 */}
      <div className="chat-list" style={{ border: "2px solid #ccc", height: "600px", overflowY: "auto", padding: "1rem"}}>
        {chatList.map((msg, idx) => (
          <div className={`messagebox ${msg.grade === 'A' ? 'left' : 'right'}`} key={msg.seq}>
            <span>{msg.message}</span>
          </div>
        ))}
      </div>

      {/* 메시지 입력창과 전송 버튼 */}
      <div className="inputbox" style={{ display: "flex", marginTop: "1rem" }}>
        <input
          style={{ flex: 1, padding: "0.5rem" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)} // 입력값 변경 시 상태 업데이트
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage(); // 엔터키로도 전송 가능
          }}
        />
        <button style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }} onClick={sendMessage}>
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoom; // 컴포넌트 내보내기