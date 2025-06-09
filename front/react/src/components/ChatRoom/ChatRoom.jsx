import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ChatRoom.css';

const formatTime = ts => {
  const d = new Date(ts);
  const h24 = d.getHours();
  const mm  = d.getMinutes().toString().padStart(2, '0');
  const ap  = h24 < 12 ? '오전' : '오후';
  const h12 = (h24 % 12) || 12;
  return `${ap} ${h12}:${mm}`;
};

const BASE_URL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

function ChatRoom() {
  const { qna_no } = useParams();
  const [chatList,     setChatList] = useState([]);
  const [content,      setContent]  = useState('');
  const [custId,       setCustId]   = useState('');
  const [grade,        setGrade]    = useState('');
  const [qnaClass,     setQnaClass] = useState(null);   // 0:미정 1:상품 2:배송
  const [inputEnabled, setInput]    = useState(false);
  const [chatEnded,    setEnded]    = useState(false);

  const stomp = useRef(null);
  const isCounselor = grade === 'A';

  // ① 로그인 사용자 정보
  useEffect(() => {
    axios.get(`${BASE_URL}/chat/userinfo`)
      .then(r => {
        setCustId(r.data.cust_id);
        setGrade(r.data.grade);
        if (r.data.grade === 'A') setInput(true);
      })
      .catch(() => alert('로그인이 필요합니다.'));
  }, []);

  // ② WebSocket 연결 및 히스토리 불러오기
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
      onConnect: () => {
        client.subscribe(`/sub/chat/room/${qna_no}`, msg => {
          const m = JSON.parse(msg.body);
          setChatList(prev => [...prev, m]);

          // 상담사 응답 시 wave 제거
          if (m.grade === 'A' && m.qna_type === 1) {
            setChatList(prev =>
              prev.map(msg =>
                msg.grade === 'C' &&
                msg.qna_type === 0 &&
                msg.content.includes('연결중') &&
                msg.wave !== false
                  ? { ...msg, wave: false }
                  : msg
              )
            );
          }

          if (m.qna_class && !qnaClass) setQnaClass(m.qna_class);

          if (!isCounselor && m.grade === 'A' && m.qna_type === 1)
            setInput(true);

          if (m.qna_type === 2) {
            setEnded(true);
            setInput(false);
          }
        });
      }
    });

    client.activate();
    stomp.current = client;

    axios.get(`${BASE_URL}/chat/history/${qna_no}`)
      .then(res => {
        setChatList(res.data);

        const clsRow = res.data.find(r => r.qna_class);
        if (clsRow) setQnaClass(clsRow.qna_class);

        if (!isCounselor &&
            res.data.some(r => r.grade === 'A' && r.qna_type === 1))
          setInput(true);

        if (res.data.some(r => r.qna_type === 2)) {
          setEnded(true);
          setInput(false);
        }
      });

    return () => client.deactivate();
  }, [qna_no, isCounselor]);

  // 메시지 발행
  const publish = body =>
    stomp.current?.publish({
      destination: '/pub/chat/message',
      body: JSON.stringify(body)
    });

  // ③ 메시지 전송
  const send = () => {
    if (!inputEnabled || !content.trim() || chatEnded) return;
    publish({
      qna_no: +qna_no,
      cust_id: custId,
      grade,
      content,
      qna_class: qnaClass ?? 0,
      qna_type: 1
    });
    setContent('');
  };

  // ④ 고객 유형 선택
  const chooseType = cls => {
    setQnaClass(cls);

    // 1) 고객 메시지
    publish({
      qna_no: +qna_no,
      cust_id: custId,
      grade,
      content:
        cls === 1
          ? '상품에 대해 문의하고 싶어요!'
          : '배송에 대해 문의하고 싶어요!',
      qna_class: cls,
      qna_type: 1
    });

    // 2) 시스템 안내 메시지
    setTimeout(() => {
      publish({
        qna_no: +qna_no,
        cust_id: 'system',
        room_create_id: custId,
        grade: 'C',
        content: '상담사와 연결중입니다... 잠시 기다려주세요.',
        qna_class: cls,
        qna_type: 0
      });
    }, 80);
  };

  // ⑤ 상담사 종료 버튼
  const finish = () => {
    if (chatEnded) return;
    publish({
      qna_no: +qna_no,
      cust_id: custId,
      grade,
      content: '문의가 종료되었습니다.',
      qna_class: qnaClass ?? 0,
      qna_type: 2
    });
  };

  // ⑥ 렌더링
  return (
    <div className="chat-room">
      <h2>채팅 상담</h2>

      {!qnaClass && !isCounselor &&
        <div className="qna-type-select">
          <button onClick={() => chooseType(1)}>상품 문의</button>
          <button onClick={() => chooseType(2)}>배송 문의</button>
        </div>}

      <div className="chat-list">
        {chatList.map(m => {
          const isSystem = m.grade === 'C' || m.cust_id === 'system' || m.qna_type === 0;
          const isCounselor = m.grade === 'A';
          const align = isSystem ? 'center'
                        : isCounselor ? 'left'
                        : 'right';

          return (
            <div
              key={`${m.qna_no}-${m.seq ?? Math.random()}`}
              className={`msg-row ${align}`}
            >
              {/* 메타 정보 */}
              {!isSystem && isCounselor &&
                <div className="meta left-meta">
                  상담사&nbsp;{m.cust_nm}&nbsp;{formatTime(m.qna_dtm)}
                </div>}
              {!isSystem && !isCounselor &&
                <div className="meta right-meta">
                  {formatTime(m.qna_dtm)}
                </div>}

              {/* 말풍선 */}
              <div
                className={[
                  'messagebox',
                  align,
                  isSystem && 'system',
                  m.wave !== false && m.qna_type === 0 && m.content.includes('연결중') && 'wave'
                ].filter(Boolean).join(' ')}
              >
                {m.content}
              </div>
            </div>
          );
        })}
      </div>

      <div className="inputbox">
        <input
          value={content}
          disabled={!inputEnabled || chatEnded}
          onChange={e => setContent(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button onClick={send} disabled={!inputEnabled || chatEnded}>
          전송
        </button>
        {isCounselor &&
          <button
            className="finish-btn"
            onClick={finish}
            disabled={chatEnded}>
            문의 종료
          </button>}
      </div>
    </div>
  );
}

export default ChatRoom;
