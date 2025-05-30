import '../styles/Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { apiCall } from '../service/apiService';
import React, { useEffect, useState } from "react";
import axios from "axios";

function Header({ cust_nm, token, isLoggedIn, onLogout }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/cust/admincheck", {
      withCredentials: true,
    })
    .then(() => setIsAdmin(true))
    .catch(() => setIsAdmin(false));
  }, []);

  const serverTest = () => {
    let url = '/test/check-server';
    apiCall(url, 'GET', null, null)
      .then((response) => {
        alert(`** 서버 API 연결 성공 => ${response.checkData}, ${response.checkLogin}`);
      })
      .catch((err) => {
        alert(`** 서버 API 연결 실패 => ${err}`);
      });
  };

  const serverDataRequest = (url) => {
    apiCall(url, 'GET', null, null)
      .then((response) => {
        alert(`** serverDataRequest 성공 url=${url}`);
        sessionStorage.setItem("serverData", JSON.stringify(response));
        navigate(url);
      })
      .catch((err) => {
        if (err === 502) {
          alert(`** 처리도중 오류 발생, err=${err}`);
        } else if (err === 403) {
          alert(`** Server Reject : 접근권한이 없습니다. => ${err}`);
        } else {
          alert(`** serverDataRequest 시스템 오류, err=${err}`);
        }
      });
  };

  const goToChat = () => {
    navigate("/chat/rooms");
  };

  const goToChatUser = async () => {
    try {
      const res = await axios.post("http://localhost:8080/chat/create", {}, { withCredentials: true });
      const { qna_no } = res.data;
      navigate(`/chat/${qna_no}`);
    } catch (err) {
      console.error("채팅방 생성 실패:", err);
      alert("채팅방 생성 중 오류가 발생했습니다.");
    }
  };

  const goToProductPage = () => {
    navigate("product");
  };

  const goToPL = () => {
    navigate("productupload");
  };

  const callstatistics = (url) => {
    navigate(url);
  };

  const goToLogin = () => {
    navigate("/Login");
  };

  return (
    <div className="headerTop">
      <h2 style={{ color: '#444444' }}>도서관</h2>
      <div className="headerLeft">
        <span onClick={serverTest} className="textlink">Server</span>&nbsp;&nbsp;
        <Link to="/">Home</Link>&nbsp;&nbsp;
        <span onClick={() => serverDataRequest("/test/memberlist")} className="textlink">DbTestList</span>&nbsp;&nbsp;

        {isAdmin ? (
          <>
            <span onClick={goToChat} className="textlink">채팅상담(관리자전용)</span>&nbsp;&nbsp;
            <span onClick={goToProductPage} className="textlink">상품목록(관리자전용)</span>&nbsp;&nbsp;
            <span onClick={goToPL} className="textlink">상품업로드</span>&nbsp;&nbsp;
            <span onClick={() => callstatistics("/statistics/data")} className="textlink">통계</span>&nbsp;&nbsp;
          </>
        ) : (
          <>
            <span onClick={goToChatUser} className="textlink">채팅상담</span>&nbsp;&nbsp;
          </>
        )}
      </div>
      <div className="headerRight">
        {isLoggedIn ? (
          <>
            <span style={{ color: 'green' }}><strong>{cust_nm}</strong> 님 환영합니다!</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <span onClick={onLogout} className="textlink">로그아웃</span>
          </>
        ) : (
          <span onClick={goToLogin} className="textlink">로그인</span>
        )}
      </div>
    </div>
  );
}

export default Header;
