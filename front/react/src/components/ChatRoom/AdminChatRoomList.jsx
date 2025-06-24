import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Link } from "react-router-dom";
import "./AdminChatRoomList.css";
import "./UserChatRoomList.css";


function AdminChatRoomList() {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

  /* ── 상태 ────────────────────────────── */
  const [rooms, setRooms] = useState([]);
  const idInputRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/cust/admincheck`, { withCredentials: true })
      .catch(() => {
        navigate('/', { replace: true });
      });
  }, [navigate]);

  /* ── 검색 실행 ───────────────────────── */
  const handleSearch = async () => {
    const custId = idInputRef.current.value.trim();
    if (!custId) {
      alert("고객 ID를 입력하세요");
      return;
    }

    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/chat/search`, {
        params: { custId },
        withCredentials: true,
      });
      setRooms(data);
    } catch (err) {
      console.error(err);
      alert("조회 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="chat-room-list">
      <div className="search-bar">
        <input
          ref={idInputRef}
          type="text"
          className="admin-search-input"
          placeholder="고객 ID 입력"
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      {/* 이하 리스트 렌더는 그대로 */}
      <ul>
        {rooms.map(r => (
          <li key={r.qna_no}>
            <Link to={`/chat/${r.qna_no}`} className="chat-room admin-chat-room">
              <div className="room-title">{r.cust_id} 님의 문의</div>
              <div className="qna-dtm">
                {new Date(r.qna_dtm).toLocaleString()}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminChatRoomList;
