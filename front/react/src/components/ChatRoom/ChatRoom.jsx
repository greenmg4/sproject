import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import './ChatRoom.css';
import { useParams } from 'react-router-dom';

const BASE_URL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

function ChatRoom() {
  const { qna_no } = useParams();
  const [chatList, setChatList] = useState([]);
  const [content, setContent]   = useState('');
  const [custId,  setCustId]   = useState('');
  const [grade,   setGrade]    = useState('');
  const [qnaClass,setQnaClass] = useState(null);
  const [inputEnabled, setInput] = useState(false);
  const [chatEnded, setEnded]   = useState(false);

  const stomp = useRef(null);
  const isCounselor = grade === 'A';

  /* ---------- 사용자 정보 ---------- */
  useEffect(() => {
    axios.get(`${BASE_URL}/chat/userinfo`)
      .then(r => {
        setCustId(r.data.cust_id);
        setGrade(r.data.grade);
        if (r.data.grade === 'A') setInput(true);   // 상담사는 바로 입력 가능
      })
      .catch(() => alert('로그인이 필요합니다.'));
  }, []);

  /* ---------- WebSocket + 히스토리 ---------- */
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
      onConnect: () => {
        client.subscribe(`/sub/chat/room/${qna_no}`, msg => {
          const m = JSON.parse(msg.body);
          setChatList(prev => [...prev, m]);

          if (m.qna_class && !qnaClass) setQnaClass(m.qna_class);

          /* 상담사 첫 답변 → 고객 입력 활성 */
          if (!isCounselor && m.grade === 'A' && m.qna_type === 1)
            setInput(true);

          /* 종료 */
          if (m.qna_type === 2) { setEnded(true); setInput(false); }
        });
      },
    });
    client.activate();
    stomp.current = client;

    axios.get(`${BASE_URL}/chat/history/${qna_no}`)
      .then(res => {
        setChatList(res.data);
        const cls = res.data.find(r => r.qna_class);
        if (cls) setQnaClass(cls.qna_class);

        /* 고객 새로고침: 이미 상담사 답변이 있다면 입력 활성 */
        if (!isCounselor && res.data.some(r => r.grade === 'A' && r.qna_type === 1))
          setInput(true);

        /* 종료 상태 복구 */
        if (res.data.some(r => r.qna_type === 2))
          { setEnded(true); setInput(false); }
      });

    return () => client.deactivate();
  }, [qna_no]);

  const publish = p =>
    stomp.current?.publish({ destination:'/pub/chat/message', body:JSON.stringify(p) });

  /* ---------- 전송 ---------- */
  const send = () => {
    if (!inputEnabled || !content.trim() || chatEnded) return;
    publish({ qna_no:+qna_no, cust_id:custId, grade,
              content, qna_class:qnaClass ?? 0, qna_type:1 });
    setContent('');
  };

  /* ---------- 고객: 문의 유형 선택 ---------- */
  const chooseType = cls => {
    setQnaClass(cls);
    publish({
      qna_no:+qna_no,
      cust_id:'test',
      grade:'A',
      content:'상담사와 연결됩니다',
      qna_class:cls,
      qna_type:0
    });
  };

  /* ---------- 상담사: 종료 ---------- */
  const finish = () => {
    if (chatEnded) return;
    publish({ qna_no:+qna_no, cust_id:custId, grade,
              content:'문의가 종료되었습니다.',
              qna_class:qnaClass ?? 0, qna_type:2 });
  };

  /* ---------- 렌더링 ---------- */
  return (
    <div className="chat-room">
      <h2>채팅 상담 #{qna_no}</h2>

      {!qnaClass && !isCounselor &&
        <div className="qna-type-select">
          <button onClick={() => chooseType(1)}>상품 문의</button>
          <button onClick={() => chooseType(2)}>배송 문의</button>
        </div>}

      <div className="chat-list">
        {chatList.map(m => {
          /* 숫자 0, 문자열 "0" 모두 시스템으로 인식 */
          const bubbleClass =
            m.qna_type == 0
              ? 'system'
              : m.grade === 'A'
                ? 'left'
                : 'right';

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
        <button onClick={send} disabled={!inputEnabled || chatEnded}>전송</button>
        {isCounselor &&
          <button className="finish-btn" onClick={finish} disabled={chatEnded}>
            문의 종료
          </button>}
      </div>
    </div>
  );
}

export default ChatRoom;
