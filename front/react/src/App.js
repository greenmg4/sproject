import './App.css'; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from './service/apiService';
import axios from 'axios';

import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';

function App() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginInfo, setLoginInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // 세션 로그인 상태 확인
  useEffect(() => {
    axios.get('/cust/session-check', { withCredentials: true })
      .then(res => {
        if (res.data.loggedIn) {
          setLoginInfo(res.data.user);
          setIsLoggedIn(true);
          setIsAdmin(res.data.user?.role === 'admin');
        } else {
          setLoginInfo(res.data);
          setIsLoggedIn(true);
          setIsAdmin(res.data.grade === 'A');
        }
      })
      .catch(err => {
        console.log("세션 체크 실패:", err);
        setIsLoggedIn(false);
        setLoginInfo(null);
        setIsAdmin(false);
      });
  }, []);

  // 로그인 상태 초기화 함수 (추가)
  const resetLoginInfo = () => {
    setIsLoggedIn(false);
    setLoginInfo(null);
    setIsAdmin(false);
  };

  // 로그인 함수
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

        //상태값(status)에 따른 처리 추가
        const status = response.status;

        if (status === 2) {
          alert("탈퇴회원입니다. 로그인이 불가능합니다.");
          setIsLoggedIn(false);
          setLoginInfo(null);
          navigate("/login");
          return;
        } else if (status === 3) {
          alert("정지된 회원입니다. 로그인이 불가능합니다.");
          setIsLoggedIn(false);
          setLoginInfo(null);
          navigate("/login");
          return;
         } else if (status !== 1) {
           alert(`알 수 없는 상태코드(${status}) 입니다.`);
           setIsLoggedIn(false);
           setLoginInfo(null);
           navigate("/login");
           return;
        }

        //정상회원(status === 1)일 경우 로그인 처리
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

  // 로그아웃 함수
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
        alert(`** 로그아웃 실패: ${err.message || err}`);
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
        userInfo={loginInfo}
      />
      <Main
        onLoginSubmit={onLoginSubmit}
        isLoggedIn={isLoggedIn}
        loginInfo={loginInfo}
        resetLoginInfo={resetLoginInfo}  
      />
      <Footer />
    </div>
  );
}

export default App;
