import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ChatRoom.css';

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

  /* ① 로그인 사용자 --------------------------------------------- */
  useEffect(() => {
    axios.get(`${BASE_URL}/chat/userinfo`)
      .then(r => {
        setCustId(r.data.cust_id);
        setGrade(r.data.grade);
        if (r.data.grade === 'A') setInput(true);       // 상담사는 바로 enable
      })
      .catch(() => alert('로그인이 필요합니다.'));
  }, []);

  /* ② WebSocket + 히스토리 -------------------------------------- */
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
      onConnect: () => {
        client.subscribe(`/sub/chat/room/${qna_no}`, msg => {
          const m = JSON.parse(msg.body);
          setChatList(prev => [...prev, m]);

          if (m.qna_class && !qnaClass) setQnaClass(m.qna_class);

          /* 상담사가 첫 답변을 주면 고객 input 활성 */
          if (!isCounselor && m.grade === 'A' && m.qna_type === 1)
            setInput(true);

          if (m.qna_type === 2) { setEnded(true); setInput(false); }
        });
      }
    });
    client.activate();
    stomp.current = client;

    /* 히스토리 */
    axios.get(`${BASE_URL}/chat/history/${qna_no}`)
      .then(res => {
        setChatList(res.data);

        const clsRow = res.data.find(r => r.qna_class);
        if (clsRow) setQnaClass(clsRow.qna_class);

        /* 상담사 답변 여부 */
        if (!isCounselor &&
            res.data.some(r => r.grade === 'A' && r.qna_type === 1))
          setInput(true);

        /* 종료 여부 */
        if (res.data.some(r => r.qna_type === 2))
          { setEnded(true); setInput(false); }
      });

    return () => client.deactivate();
  }, [qna_no, isCounselor]);

  const publish = body =>
    stomp.current?.publish({
      destination: '/pub/chat/message',
      body: JSON.stringify(body)
    });

  /* ③ 메시지 전송 ---------------------------------------------- */
  const send = () => {
    if (!inputEnabled || !content.trim() || chatEnded) return;
    publish({
      qna_no: +qna_no,
      cust_id: custId,
      grade,
      content,
      qna_class: qnaClass ?? 0,
      qna_type: 1                 // 일반 메시지
    });
    setContent('');
  };

  /* ④ 고객: 상품/배송 버튼 클릭 --------------------------------- */
  const chooseType = cls => {
    setQnaClass(cls);

    /* 시스템 계정으로 단 한 번만 안내 */
    publish({
      qna_no:  +qna_no,
      cust_id: 'system',
      room_create_id: custId,
      grade:   'C',
      content: '상담사와 연결중입니다... 잠시 기다려주세요.',
      qna_class: cls,             // 1=상품 2=배송
      qna_type: 0                 // 시스템
    });
  };

  /* ⑤ 상담사: 종료 --------------------------------------------- */
  const finish = () => {
    if (chatEnded) return;
    publish({
      qna_no: +qna_no,
      cust_id: custId,
      grade,
      content: '문의가 종료되었습니다.',
      qna_class: qnaClass ?? 0,
      qna_type: 2                 // 종료
    });
  };

  /* ⑥ 렌더링 ---------------------------------------------------- */
  return (
    <div className="chat-room">
      <h2>채팅 상담 #{qna_no}</h2>

      {/* 문의 유형 미선택 & 고객일 때만 노출 */}
      {!qnaClass && !isCounselor &&
        <div className="qna-type-select">
          <button onClick={() => chooseType(1)}>상품 문의</button>
          <button onClick={() => chooseType(2)}>배송 문의</button>
        </div>}

      <div className="chat-list">
        {chatList.map(m => {
          const isSystem =
            m.qna_type === 0 || m.cust_id === 'system' || m.grade === 'C';
          const bubbleClass = isSystem
            ? 'system'
            : m.grade === 'A' ? 'left' : 'right';
          return (
            <div
              key={`${m.qna_no}-${m.seq ?? Math.random()}`}
              className={`messagebox ${bubbleClass}`}>
              {m.content}
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
