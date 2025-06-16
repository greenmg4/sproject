import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * 회원 탈퇴 페이지
 * - 버튼 클릭 시 서버에 탈퇴 요청
 * - cust_id는 세션에서 서버가 직접 가져가므로 프론트는 전달하지 않음
 */
const UserWithdraw = ({ resetLoginInfo }) => {
  const [showConfirm, setShowConfirm] = useState(false); // 확인창 표시 여부
  const [withdrawSuccess, setWithdrawSuccess] = useState(false); // 탈퇴 성공 여부
  const navigate = useNavigate();

  // 탈퇴 버튼 클릭 시 확인 모달 열기
  const handleWithdrawClick = () => {
    setShowConfirm(true);
  };

  // '예' 클릭 시 탈퇴 요청
  const handleConfirmYes = async () => {
    try {
      // ❗ cust_id 전달 제거 → 서버에서 세션으로 cust_id를 확인함
      const res = await axios.post('/cust/withdraw', {}, { withCredentials: true });

      if (res.data.success) {
        setWithdrawSuccess(true);
        resetLoginInfo(null); // App의 로그인 상태 초기화

        setTimeout(() => {
          alert('탈퇴가 완료되었습니다.');
          navigate('/');
        }, 1000);
      } else {
        alert('탈퇴 실패: ' + res.data.message);
      }
    } catch (error) {
      console.error('탈퇴 오류:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  // '아니오' 클릭 시 확인 모달 닫기
  const handleConfirmNo = () => {
    setShowConfirm(false);
  };

  // 탈퇴 완료 메시지
  if (withdrawSuccess) {
    return (
      <div>
        <h2>탈퇴가 완료되었습니다.</h2>
        <p>그동안 이용해 주셔서 감사합니다.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>회원 탈퇴</h2>
      <button onClick={handleWithdrawClick} style={{ color: 'red' }}>
        회원 탈퇴하기
      </button>

      {showConfirm && (
        <div className="modal">
          <p>정말 탈퇴하시겠습니까? 탈퇴 완료 시 복구가 불가능 합니다.</p>
          <button onClick={handleConfirmYes}>예</button>
          <button onClick={handleConfirmNo}>아니오</button>
        </div>
      )}
    </div>
  );
};

export default UserWithdraw;
