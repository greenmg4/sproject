import './App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from './service/apiService';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';
import ChatRoomList from './components/ChatRoomList';
import ChatRoom from './components/ChatRoom';

function App() {
  const navigate = useNavigate();

  //const [isLoggedIn, setIsLoggedIn] = useState(false);  // 로그인 상태 저장 변수
  //const [loginInfo, setLoginInfo] = useState(""); // 회원 로그인 정보

  return (
  <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/chat/rooms" element={<ChatRoomList />} /> 
          <Route path="/chat/:roomId" element={<ChatRoom />} />
        </Routes>
        <Footer />
      </div>
    );
  }

export default App;
