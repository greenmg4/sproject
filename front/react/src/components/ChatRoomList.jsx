// ChatRoomList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ChatRoomList.css";

const BASE_URL = "http://localhost:8080";

const ChatRoomList = () => {
  const [rooms, setRooms] = useState([]);
   const [sender, setSender] = useState(""); // sender 선언

  useEffect(() => {
    axios.get(`${BASE_URL}/chat/rooms`)
      .then((res) => {
        setRooms(res.data); // [{ roomId: 1, lastMessage: "안녕하세요" }, ...]
      })
      .catch((err) => {
        console.error("❌ 방 목록 조회 실패:", err);
      });

    axios.get(`${BASE_URL}/chat/userinfo`, {
      params: { custId: "user1234" }
    })
    .then((res) => {
      const { custId} = res.data;
      setSender(custId);     // DB insert용 sender
    });

  }, []);

  return (
    <div className="chat-room-list">
      <h2>상담 목록</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.roomId}>
            <Link to={`/chat/${room.roomId}`}>
              <div className="room-title">{sender}님의 문의</div>
              <div className="last-message">{room.lastMessage || "(메시지 없음)"}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomList;
