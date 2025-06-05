import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Link } from 'react-router-dom';
import './ChatRoomList.css';

const BASE_URL = 'http://localhost:8080';

function ChatRoomList() {
  const [rooms, setRooms] = useState([]);
  const stomp = useRef(null);

  /* ① 최초 목록 -------------------------------------------------- */
  useEffect(() => {
    axios.get(`${BASE_URL}/chat/rooms`)
      .then(res => setRooms(
        res.data
          /* “어떤 것을 도와드릴까요?”(qna_class=0, system) 행 제외 */
          .filter(r => !(r.cust_id === 'system' && r.qna_class === 0))
          .filter(r => r.qna_type !== 2)   // 종료방 제외
          .map(r => ({ ...r, lastMessage: r.content, unread: false }))
      ))
      .catch(console.error);

    /* ② WebSocket 구독 ----------------------------------------- */
    const client = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
      onConnect: () => {
        client.subscribe('/sub/chat/summary', msg => {
          const m = JSON.parse(msg.body);

          /* “어떤 것을 도와드릴까요?” 무시 */
          if (m.cust_id === 'system' && m.qna_class === 0) return;

          /* 종료 메시지 */
          if (m.qna_type === 2) {
            setRooms(prev => prev.filter(r => r.qna_no !== m.qna_no));
            return;
          }

          setRooms(prev => {
            const exists = prev.find(r => r.qna_no === m.qna_no);
            if (exists) {          // 기존 방: 마지막 메시지 갱신
              return prev.map(r =>
                r.qna_no === m.qna_no
                  ? { ...r, lastMessage: m.content, unread: true }
                  : r
              );
            }
            /* 새 방 추가 */
            return [{ ...m, lastMessage: m.content, unread: true }, ...prev];
          });
        });
      }
    });
    client.activate();
    stomp.current = client;
    return () => client.deactivate();
  }, []);

  /* ③ 렌더링 ---------------------------------------------------- */
  return (
  <div className="chat-room-list">
      <h2>상담 목록</h2>
      <ul>
        {rooms.map(r => (
          <li key={r.qna_no}>
            <Link to={`/chat/${r.qna_no}`} className="chat-room">
              <div className="room-title">
                {r.room_create_id
                  ? `${r.room_create_id}님의 문의`          // ① owner_id가 있으면 바로 사용
                  : r.cust_id === 'system'
                      ? '고객 문의'                   // ② system 메시지면 기본 문구
                      : `${r.cust_id}님의 문의`      // ③ 그 외엔 cust_id 사용
                }
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
