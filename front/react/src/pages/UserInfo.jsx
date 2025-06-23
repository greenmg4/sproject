import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/User/UserInfo.css'; // ✅ CSS 분리 파일 import

const UserInfoPage = ({ loginInfo, isLoggedIn }) => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  const goToEditPage = () => navigate("/useredit");
  const goToAddressPage = () => navigate("/useraddress", { state: { loginInfo: userInfo } });
  const goToWithdraw = () => navigate("/userwithdraw");
  const orderList = () => navigate("/orderList");

  useEffect(() => {
    if (loginInfo && loginInfo.cust_id) {
      axios.post(`${API_BASE_URL}/api/user/info`, { cust_id: loginInfo.cust_id }, { withCredentials: true })
        .then(res => setUserInfo(res.data))
        .catch(() => {
          alert('로그인이 필요합니다.');
          navigate('/login');
        });
    }
  }, [loginInfo, navigate]);

  if (!userInfo) return <div style={{ textAlign: 'center', marginTop: '50px' }}>불러오는 중...</div>;

  return (
    <div className="user-info-container">
      <h2 className="user-info-title">내정보</h2>

      <ul className="user-info-list">
        <li className="user-info-item"><span className="user-info-label">아이디:</span><span className="user-info-value">{userInfo.cust_id}</span></li>
        <li className="user-info-item"><span className="user-info-label">이름:</span><span className="user-info-value">{userInfo.cust_nm}</span></li>
        <li className="user-info-item"><span className="user-info-label">전화번호:</span><span className="user-info-value">{userInfo.phone}</span></li>
        <li className="user-info-item"><span className="user-info-label">이메일:</span><span className="user-info-value">{userInfo.email}</span></li>
        <li className="user-info-item"><span className="user-info-label">주소1:</span><span className="user-info-value">{userInfo.address1}</span></li>
        <li className="user-info-item"><span className="user-info-label">주소2:</span><span className="user-info-value">{userInfo.address2}</span></li>
        <li className="user-info-item"><span className="user-info-label">우편번호:</span><span className="user-info-value">{userInfo.zip}</span></li>
        <li className="user-info-item"><span className="user-info-label">성별:</span><span className="user-info-value">{userInfo.gender}</span></li>
        <li className="user-info-item"><span className="user-info-label">생일:</span><span className="user-info-value">{userInfo.birthday}</span></li>
        <li className="user-info-item"><span className="user-info-label">등급:</span><span className="user-info-value">{userInfo.grade}</span></li>
        <li className="user-info-item">
          <span className="user-info-label">총 구매 금액:</span>
          <span className="user-info-value">{userInfo.tot_buy_amt}원</span>
          <button className="user-info-order-btn" onClick={orderList}>결제 내역</button>
        </li>
      </ul>

      <button className="user-info-btn" onClick={goToAddressPage}>배송지 관리</button>
      <button className="user-info-btn2" onClick={goToEditPage}>내정보 수정</button>
      <button className="user-info-withdraw-text" onClick={goToWithdraw}>탈퇴하기</button>
    </div>
  );
};

export default UserInfoPage;
