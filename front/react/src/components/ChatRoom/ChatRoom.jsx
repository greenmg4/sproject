import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import "./ChatRoom.css";
import { useParams } from "react-router-dom";

const BASE_URL = "http://localhost:8080";

const ChatRoom = () => {
  const { qna_no } = useParams(); // 백엔드 DTO 기준으로 필드명 수정
  const [chatList, setChatList] = useState([]);
  const [content, setContent] = useState(""); // message -> content
  const stompClient = useRef(null);
  const [cust_id, setCustId] = useState("");
  const [grade, setGrade] = useState("");

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
      onConnect: () => {
        console.log("WebSocket 연결됨");
        client.subscribe(`/sub/chat/room/${qna_no}`, (res) => {
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

    axios.get(`${BASE_URL}/chat/history/${qna_no}`)
      .then((res) => {
        setChatList(res.data);
      })
      .catch((err) => {
        console.error("채팅 내역 불러오기 실패:", err);
      });

    axios.get(`${BASE_URL}/chat/userinfo`, {
      params: { cust_id: "user1234" },
    })
      .then((res) => {
        const { cust_id, grade } = res.data;
        setCustId(cust_id);
        setGrade(grade);
      });

    return () => {
      client.deactivate();
    };
  }, [qna_no]);

  const sendMessage = () => {
    if (!content.trim()) return;

    const payload = {
      qna_no: parseInt(qna_no),
      cust_id,
      content,
      grade,
    };

    stompClient.current.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify(payload),
    });

    setContent("");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2>채팅 상담 {qna_no}</h2>
      <div className="chat-list" style={{ border: "2px solid #ccc", height: "600px", overflowY: "auto", padding: "1rem" }}>
        {chatList.map((msg) => (
          <div className={`messagebox ${msg.grade === 'A' ? 'left' : 'right'}`} key={msg.seq}>
            <span>{msg.content}</span>
          </div>
        ))}
      </div>
      <div className="inputbox" style={{ display: "flex", marginTop: "1rem" }}>
        <input
          style={{ flex: 1, padding: "0.5rem" }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}
          onClick={sendMessage}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
