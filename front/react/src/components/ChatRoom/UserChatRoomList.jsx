import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Link, useNavigate } from 'react-router-dom';
import './UserChatRoomList.css';

const BASE_URL = 'http://localhost:8080';

function UserChatRoomList() {
  const [rooms, setRooms] = useState([]);        // 화면용 채팅방 목록
  const [myQnaNos, setMyQnaNos] = useState([]);  // 내가 가진 qna_no 집합
  const stomp = useRef(null);
	const navigate = useNavigate();

	const goToChatUser = async () => {
		const custId = sessionStorage.getItem("loginID");
		if (!custId) {
			alert("로그인이 필요한 기능입니다.");
			return;
		}

		const confirmed = window.confirm("채팅문의를 시작하시겠습니까?");
		if (!confirmed) return;

		try {
			const res = await axios.post(`${BASE_URL}/chat/create`, {}, { withCredentials: true });
			const { qna_no } = res.data;
			navigate(`/chat/${qna_no}`);
		} catch (err) {
			console.error("채팅방 생성 실패:", err);
			alert("채팅방 생성 중 오류가 발생했습니다."); 
		}
};

  /* ① 최초 목록 -------------------------------------------------- */
  useEffect(() => {
    axios.get(`${BASE_URL}/chat/mychats`)
      .then(res => {
        /* system 안내 제외 + qna_no별 최신 seq만 남기기 */
        const latestMap = new Map();              // { qna_no → 메시지 }
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

    /* ② WebSocket ------------------------------------------------ */
    const client = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
      onConnect: () => {
        client.subscribe('/sub/chat/summary', msg => {
          const m = JSON.parse(msg.body);

          if (m.cust_id === 'system' && m.qna_class === 0) return; // system 안내
          if (!myQnaNos.includes(m.qna_no)) return;                // 내 방만

          setRooms(prev => {
            const exists = prev.find(r => r.qna_no === m.qna_no);
            if (exists) {
              /* 더 최신(seq 큰) 메시지만 반영 */
              if (m.seq > exists.seq) {
                return prev.map(r =>
                  r.qna_no === m.qna_no
                    ? { ...r,
                        lastMessage: m.content,
                        unread: true,
                        seq: m.seq,
                        qna_type: m.qna_type,   // 종료 여부 업데이트
                      }
                    : r
                );
              }
              return prev; // 옛 메시지는 무시
            }
            /* 새 방 */
            return [{ ...m, lastMessage: m.content, unread: true }, ...prev];
          });
        });
      },
    });
    client.activate();
    stomp.current = client;

    return () => client.deactivate();             // 클린업
  }, [myQnaNos]);

  /* ③ 렌더 ------------------------------------------------------ */
  return (
    <div className="chat-room-list">
      <h2>내 문의내역</h2>
			<button onClick={goToChatUser} style={{ marginBottom: '15px' }}>
  			채팅상담 시작
			</button>
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

                <div className="last-message">
                  {r.lastMessage || '(메시지 없음)'}
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
