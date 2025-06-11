import './App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from './service/apiService';
import axios from "axios";

import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';

function App() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginInfo, setLoginInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // 서버 세션 기반 로그인 확인 (sessionStorage 안 씀!)
  useEffect(() => {
    axios.get('/cust/session-check', { withCredentials: true })
      .then(res => {
        setIsLoggedIn(true);
        setLoginInfo(res.data);
        if (res.data.grade === 'A') {
          setIsAdmin(true);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setLoginInfo(null);
        setIsAdmin(false);
      });
  }, []);

  // ✅ 로그인 함수
  const onLoginSubmit = (cust_Id, Password) => {
    const url = "/cust/login";
    const data = { cust_id: cust_Id, password: Password };

    apiCall(url, 'POST', data, null)
      .then((response) => {
        if (!response || !response.cust_id) {
          alert("id 또는 password 가 다릅니다, 다시하세요 ~~");
          setIsLoggedIn(false);
          setLoginInfo(null);
          navigate("/login");
          return;
        }

        alert('로그인 성공');
        setIsLoggedIn(true);
        setLoginInfo(response);
        if (response.grade === 'A') {
          setIsAdmin(true);
        }
        navigate("/");
      })
      .catch((err) => {
        setIsLoggedIn(false);
        setLoginInfo(null);
        setIsAdmin(false);

        if (err?.status === 502) {
          alert("id 또는 password 가 다릅니다, 다시하세요 ~~");
        } else if (err?.response?.status === 403) {
          alert(`** Server Reject : 접근권한이 없습니다. => ${err.message}`);
        } else {
          alert(`** onLoginSubmit 시스템 오류, err=${err.message || err}`);
        }
        navigate("/login");
      });
  };

  // ✅ 로그아웃 함수 (변경 없음)
  const onLogout = () => {
    console.log("로그아웃 함수 실행");

    const url = "/cust/logout";

    axios.get(url, { withCredentials: true })
      .then(() => {
        console.log("서버 로그아웃 요청 성공");
        setIsLoggedIn(false);
        setLoginInfo(null);
        setIsAdmin(false);
        alert('로그아웃 성공');
        navigate("/");
      })
      .catch((err) => {
        if (err?.status === 502) {
          alert("로그아웃 실패, 다시 시도하세요 ~~");
        } else if (err?.response?.status === 403) {
          alert(`** Server Reject : 접근권한이 없습니다. => ${err.message || err}`);
        } else {
          alert(`** onLogout 시스템 오류, err=${err.message || err}`);
        }
        console.error("로그아웃 실패 에러:", err);
        setIsLoggedIn(false);
        setLoginInfo(null);
        setIsAdmin(false);
        navigate("/");
      });
  };

  return (
    <div className="App">
      <Header
        cust_nm={loginInfo?.cust_nm}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogout={onLogout}
      />
      <Main
        onLoginSubmit={onLoginSubmit}
        isLoggedIn={isLoggedIn}
        loginInfo={loginInfo}
      />
      <Footer />
    </div>
  );
}

export default App;
