import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Link, useNavigate } from 'react-router-dom';
import './UserChatRoomList.css';


const formatDateTime = ts => {
  const d   = new Date(ts);
  const date = d.toISOString().slice(0, 10);
  const h24  = d.getHours();
  const mm   = d.getMinutes().toString().padStart(2, '0');
  const ap   = h24 < 12 ? '오전' : '오후';
  const h12  = (h24 % 12) || 12;
  return `${date} ${ap} ${h12}:${mm}`;
};

function UserChatRoomList() {
  const API_BASE_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:8080';


  const [rooms, setRooms]     = useState([]);   
  const [myQnaNos, setMyQnaNos] = useState([]);
  const myQnaNosRef           = useRef([]);     
  const stomp                 = useRef(null);
  const navigate              = useNavigate();

  /* ───────────────────────────── 채팅방 생성 ───────────────────────────── */
  const goToChatUser = async () => {
    try {
      await axios.get(`${API_BASE_URL}/api/cust/session-check`, { withCredentials: true });

      if (!window.confirm('채팅문의를 시작하시겠습니까?')) return;

      const { data } = await axios.post(
        `${API_BASE_URL}/api/chat/create`,
        {},
        { withCredentials: true }
      );
      navigate(`/chat/${data.qna_no}`);
    } catch (err) {
      if (err.response?.status === 401) {
        alert('로그인이 필요한 기능입니다.');
      } else {
        console.error('채팅방 생성 실패:', err);
        alert('채팅방 생성 중 오류가 발생했습니다.');
      }
    }
  };

  /* ① 최초 목록 조회 ─────────────────────────────────────────────────── */
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/chat/mychats`, { withCredentials: true })
      .then(res => {
        // system 안내 제외 + qna_no별 최신 seq만
        const latestMap = new Map();
        res.data.forEach(m => {
          if (m.cust_id === 'system' && m.qna_class === 0) return;
          const saved = latestMap.get(m.qna_no);
          if (!saved || m.seq > saved.seq) latestMap.set(m.qna_no, m);
        });

        const list = Array.from(latestMap.values()).map(r => ({
          ...r,
          lastMessage: r.content,
          unread: false,
        }));

        setRooms(list);
        setMyQnaNos(list.map(r => r.qna_no));
      })
      .catch(console.error);
  }, []);

  /* ② myQnaNos 변경 시 ref 갱신 ───────────────────────────────────────── */
  useEffect(() => {
    myQnaNosRef.current = myQnaNos;
  }, [myQnaNos]);

  /* ③ WebSocket 연결 ────────────────────────────────────────────────── */
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE_URL}/stomp`),
      reconnectDelay: 5000,
      debug: () => {},
      onConnect: () => {
        client.subscribe('/sub/chat/summary', msg => {
          const m = JSON.parse(msg.body);

          // system 안내 & 내 방 필터
          if (m.cust_id === 'system' && m.qna_class === 0) return;
          if (!myQnaNosRef.current.includes(m.qna_no))       return;

          // rooms 상태 업데이트
          setRooms(prev => {
            const exists = prev.find(r => r.qna_no === m.qna_no);
            if (exists) {
              if (m.seq > exists.seq) {
                return prev.map(r =>
                  r.qna_no === m.qna_no
                    ? {
                        ...r,
                        lastMessage: m.content,
                        qna_dtm:     m.qna_dtm, // ★ 시간 동기화
                        unread:      true,
                        seq:         m.seq,
                        qna_type:    m.qna_type,
                      }
                    : r
                );
              }
              return prev; // 옛 메시지는 무시
            }
            // 새 채팅방
            return [
              { ...m, lastMessage: m.content, unread: true },
              ...prev,
            ];
          });
        });
      },
    });

    client.activate();
    stomp.current = client;
    return () => client.deactivate(); // 언마운트 시 해제
  }, []);

  /* ④ 렌더 ───────────────────────────────────────────────────────────── */
  return (
    <div className="chat-room-list">
      <h2>내 문의내역</h2>

      <div style={{ textAlign: 'center' }}>
        <button onClick={goToChatUser}>채팅상담 시작</button>
      </div>

      <ul>
        {rooms.map(r => {
          const isClosed = r.qna_type === 2 || r.qna_type === '2';
          return (
            <li key={r.qna_no}>
              <Link
                to={`/chat/${r.qna_no}`}
                className={`chat-room ${isClosed ? 'closed' : ''}`}
              >
                <div className="room-title">
                  {isClosed ? '상담사 답변완료' : '상담중'}
                  {!isClosed && r.unread && (
                    <span className="notification-dot" />
                  )}
                </div>

                <div className="last-line">
                  <span className="last-message">
                    {r.lastMessage || '(메시지 없음)'}
                  </span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="qna-dtm">
                    {formatDateTime(r.qna_dtm)}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default UserChatRoomList;
