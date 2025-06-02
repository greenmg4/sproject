import './App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from './service/apiService';

import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';

function App() {
  const navigate = useNavigate();

  // 로그인 상태 저장 (true: 로그인 된 상태, false: 로그아웃 상태)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인한 사용자 정보 저장 (cust_id, cust_nm 등 서버에서 받은 정보)
  const [loginInfo, setLoginInfo] = useState(null);

  // 컴포넌트가 마운트 될 때 (앱 실행 시 최초 1회)
  // sessionStorage에 저장된 로그인 정보를 가져와서 로그인 상태를 복원함
  useEffect(() => {
    const storedLoginInfo = sessionStorage.getItem("loginInfo");
    if (storedLoginInfo) {
      const parsedLoginInfo = JSON.parse(storedLoginInfo);
      setIsLoggedIn(true);
      setLoginInfo(parsedLoginInfo);
    }
  }, []);

  // 로그인 함수
  // cust_Id, Password를 받아 서버에 로그인 요청을 보냄
  const onLoginSubmit = (cust_Id, Password) => {
    const url = "/cust/login";
    const data = { cust_id: cust_Id, password: Password };

    // apiCall은 axios를 이용해 POST 요청 보내는 함수
    // data는 요청 바디에 담겨 전송됨
    apiCall(url, 'POST', data, null)
      .then((response) => {
        // 로그인 성공 시 서버가 반환하는 response가 있을 때
        if (!response || !response.cust_id) {
          // 서버가 이상한 응답을 주면 로그인 실패로 간주하고 경고창 띄움
          alert("id 또는 password 가 다릅니다, 다시하세요 ~~");
          setIsLoggedIn(false);
          setLoginInfo(null);
          navigate("/login");
          return; // 여기서 종료해서 아래 코드 실행 안 됨
        }

        // 로그인 성공 시 받은 사용자 정보를 sessionStorage에 저장
        // 나중에 새로고침해도 로그인 상태 유지 가능
        sessionStorage.setItem("loginInfo", JSON.stringify(response));
        sessionStorage.setItem("loginID", response.cust_id);

        alert('로그인 성공');
        setIsLoggedIn(true);
        setLoginInfo(response);
        navigate("/"); // 로그인 후 메인 페이지로 이동
      })
      .catch((err) => {
        // 로그인 실패 시 에러를 받아 처리
        setIsLoggedIn(false);
        setLoginInfo(null);

        // 상태에 따라 다른 메시지 띄움
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
  // 서버에 로그아웃 요청을 보내고 클라이언트 세션 초기화
  const onLogout = () => {
    // 토큰이 없으면 서버 로그아웃 API 호출 생략하고 클라이언트만 초기화
    if (!loginInfo || !loginInfo.token) {
      sessionStorage.clear(); // sessionStorage 완전 초기화
      setIsLoggedIn(false);
      setLoginInfo(null);
      alert('로그아웃 성공');
      navigate("/");
      return;
    }

    const url = "/auth/logout";

    // apiCall로 로그아웃 요청 보내는데 토큰을 헤더에 넣어 인증 처리함
    apiCall(url, 'GET', null, loginInfo.token)
      .then(() => {
        // 로그아웃 성공 시 세션 초기화
        sessionStorage.clear();
        setIsLoggedIn(false);
        setLoginInfo(null);
        alert('로그아웃 성공');
        navigate("/");
      })
      .catch((err) => {
        // 로그아웃 실패 시 에러 처리
        if (err?.status === 502) {
          alert("로그아웃 실패, 다시 시도하세요 ~~");
        } else if (err?.response?.status === 403) {
          alert(`** Server Reject : 접근권한이 없습니다. => ${err.message || err}`);
        } else {
          alert(`** onLogout 시스템 오류, err=${err.message || err}`);
        }
        // 로그아웃 실패해도 클라이언트 상태는 로그아웃 상태로 초기화해서 꼬임 방지
        sessionStorage.clear();
        setIsLoggedIn(false);
        setLoginInfo(null);
        navigate("/");
      });
  };

  return (
    <div className="App">
      {/* Header 컴포넌트에 로그인 상태와 이름, 로그아웃 함수 전달 */}
      <Header
        cust_nm={loginInfo?.cust_nm}
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
      />

      {/* Main 컴포넌트에 로그인 함수와 상태 정보 전달 */}
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
