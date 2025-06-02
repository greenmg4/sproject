// src/pages/UserInfoPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserInfoPage = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
   const userId = sessionStorage.getItem('loginID');
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 백엔드에 POST 요청
    axios.post('/api/user/info', { cust_id }, {
  headers: { 'Content-Type': 'application/json' }
})
    .then(res => {
      setUserInfo(res.data);
    })
    .catch(err => {
      console.error('유저 정보를 가져오는 데 실패했습니다.', err);
    });
  }, []);

  if (!userInfo) {
    return <div>불러오는 중...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>내 정보</h2>
      <ul>
        <li><strong>아이디:</strong> {userInfo.cust_id}</li>
        <li><strong>이름:</strong> {userInfo.cust_nm}</li>
        <li><strong>전화번호:</strong> {userInfo.phone}</li>
        <li><strong>주소1:</strong> {userInfo.address1}</li>
        <li><strong>주소2:</strong> {userInfo.address2}</li>
        <li><strong>우편번호:</strong> {userInfo.zip}</li>
        <li><strong>성별:</strong> {userInfo.gender}</li>
        <li><strong>생일:</strong> {userInfo.birthday}</li>
        <li><strong>등급:</strong> {userInfo.grade}</li>
        <li><strong>총 구매 금액:</strong> {userInfo.tot_buy_amt}원</li>
      </ul>
    </div>
  );
};

export default UserInfoPage;
