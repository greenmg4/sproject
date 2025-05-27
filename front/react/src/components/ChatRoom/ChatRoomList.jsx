import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "./ChatRoomList.css";

const BASE_URL = "http://localhost:8080";

const ChatRoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [custId, setCustId] = useState("");
  const stompClient = useRef(null);

  useEffect(() => {
    // 채팅방 목록 조회
    axios.get(`${BASE_URL}/chat/rooms`)
      .then((res) => {
        const initialRooms = res.data.map(room => ({ ...room, unread: false }));
        setRooms(initialRooms);
      })
      .catch((err) => {
        console.error("방 목록 조회 실패:", err);
      });

    // 사용자 정보 조회
    axios.get(`${BASE_URL}/chat/userinfo`, {
      params: { cust_id: "user1234" }
    })
      .then((res) => {
        setCustId(res.data.cust_id);  // 필드명 변경
      });

    // WebSocket 연결
    const client = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
      onConnect: () => {
        console.log("[List] WebSocket 연결됨");

        client.subscribe("/sub/chat/summary", (res) => {
          const incomingMsg = JSON.parse(res.body);
          console.log("요약 메시지:", incomingMsg);

          setRooms((prevRooms) => {
            const updated = prevRooms.map((room) =>
              room.qna_no === incomingMsg.qna_no
                ? { ...room, lastMessage: incomingMsg.content, unread: true }
                : room
            );

            const target = updated.find((r) => r.qna_no === incomingMsg.qna_no);
            const others = updated.filter((r) => r.qna_no !== incomingMsg.qna_no);
            return [target, ...others];
          });
        });
      },
      onStompError: (err) => {
        console.error("STOMP 에러:", err);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <div className="chat-room-list">
      <h2>상담 목록</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.qna_no}>
            <Link to={`/chat/${room.qna_no}`} className="chat-room">
              <div className="room-title">
                {custId}님의 문의
                {room.unread && <span className="notification-dot" />}
              </div>
              <div className="last-message">{room.lastMessage || "(메시지 없음)"}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomList;
