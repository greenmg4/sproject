import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "./ChatRoomList.css";

const BASE_URL = "http://localhost:8080";

const ChatRoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [sender, setSender] = useState("");
  const stompClient = useRef(null);

  useEffect(() => {
    // 채팅방 목록 조회
    axios.get(`${BASE_URL}/chat/rooms`)
      .then((res) => {
        // 초기 상태: unread false
        const initialRooms = res.data.map(room => ({ ...room, unread: false }));
        setRooms(initialRooms);
      })
      .catch((err) => {
        console.error("방 목록 조회 실패:", err);
      });

    // 사용자 정보
    axios.get(`${BASE_URL}/chat/userinfo`, {
      params: { custId: "user1234" }
    })
    .then((res) => {
      setSender(res.data.custId);
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
              room.roomId === incomingMsg.roomId
                ? { ...room, lastMessage: incomingMsg.message, unread: true }
                : room
            );

            // 새 메시지 온 방을 맨 앞으로
            const target = updated.find((r) => r.roomId === incomingMsg.roomId);
            const others = updated.filter((r) => r.roomId !== incomingMsg.roomId);
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
          <li key={room.roomId}>
            <Link to={`/chat/${room.roomId}`} className="chat-room">
              <div className="room-title">
                {sender}님의 문의
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
