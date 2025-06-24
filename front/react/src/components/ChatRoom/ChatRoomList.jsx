import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';   // ✅ navigate 추가
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import './ChatRoomList.css';


function ChatRoomList() {
    const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8080';
  const [rooms, setRooms] = useState([]);
  const stomp = useRef(null);
  const navigate = useNavigate();                       // ✅

  /* ① 관리자 체크 + 초기화 --------------------------------------- */
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/cust/admincheck`, { withCredentials: true })
      .then(() => init())                               // 통과 → 초기화
      .catch(() => {
        navigate('/', { replace: true });
      });

    /* 초기화 로직을 함수로 분리 */
    function init() {
      /* ①-1 방 목록 조회 */
      axios
        .get(`${API_BASE_URL}/api/chat/rooms`, { withCredentials: true })
        .then(res =>
          setRooms(
            res.data
              .filter(r => !(r.cust_id === 'system' && r.qna_class === 0))
              .filter(r => r.qna_type !== 2) // 종료방 제외
              .map(r => ({ ...r, lastMessage: r.content, unread: false }))
          )
        )
        .catch(console.error);

      /* ①-2 WebSocket 구독 */
      const client = new Client({
        webSocketFactory: () => new SockJS(`${API_BASE_URL}/stomp`),
        onConnect: () => {
          client.subscribe('/sub/chat/summary', msg => {
            const m = JSON.parse(msg.body);

            if (m.cust_id === 'system' && m.qna_class === 0) return;
            if (m.qna_type === 2) {
              setRooms(prev => prev.filter(r => r.qna_no !== m.qna_no));
              return;
            }

            setRooms(prev => {
              const exists = prev.find(r => r.qna_no === m.qna_no);
              if (exists) {
                return prev.map(r =>
                  r.qna_no === m.qna_no
                    ? { ...r, lastMessage: m.content, unread: true }
                    : r
                );
              }
              return [{ ...m, lastMessage: m.content, unread: true }, ...prev];
            });
          });
        }
      });
      client.activate();
      stomp.current = client;

      /* 클린업 */
      return () => client.deactivate();
    }
  }, [navigate]);

  /* ② 렌더링 ---------------------------------------------------- */
return (
  <div className="chat-room-list">
    <div className="chat-room-toolbar">
      <button
        className="search-room-btn"
        onClick={() => navigate("/adminchatlist")}
      >
        상담기록 검색
      </button>
    </div>

    <h2>현재 상담목록</h2>

    <ul>
      {rooms.map(r => (
        <li key={r.qna_no}>
          <Link to={`/chat/${r.qna_no}`} className="chat-room">
            <div className="room-title">
              {r.room_create_id
                ? `${r.room_create_id}님의 문의`
                : r.cust_id === 'system'
                ? '고객 문의'
                : `${r.cust_id}님의 문의`}
              {r.unread && <span className="notification-dot" />}
            </div>
            <div className="last-message">
              {r.lastMessage || '(메시지 없음)'}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

}

export default ChatRoomList;
