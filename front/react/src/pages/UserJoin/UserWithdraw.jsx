import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal'; // ❗ 최종 확인용 모달은 계속 사용

/**
 * 회원 탈퇴 페이지
 */
const UserWithdraw = ({ resetLoginInfo }) => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const [showPrompt, setShowPrompt] = useState(false); // 탈퇴 여부 안내 표시용
  const [showFinalModal, setShowFinalModal] = useState(false); // 최종 모달 표시 여부
  const [withdrawSuccess, setWithdrawSuccess] = useState(false); // 탈퇴 완료 여부
  const navigate = useNavigate();

  // "회원 탈퇴하기" 버튼 클릭 시 탈퇴 확인 안내문 표시
  const handleWithdrawClick = () => {
    setShowPrompt(true); // 안내문 표시
  };

  // 첫 번째 안내에서 "예" 텍스트 클릭 시 → 모달창 띄움
  const handleFirstYesClick = () => {
    setShowFinalModal(true); // 진짜 확인 모달 표시
  };

  // 안내창에서 "아니오" 클릭 시 내정보 페이지로 이동
  const handleCancel = () => {
    setShowPrompt(false); // 안내문 숨김
    navigate('/userinfo');
  };

  // 모달에서 최종 "예" 클릭 시 탈퇴 처리
  const handleFinalConfirm = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/cust/withdraw`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setWithdrawSuccess(true); // 완료 표시
        resetLoginInfo(null); // 로그인 상태 초기화

        setTimeout(() => {
          alert('탈퇴가 완료되었습니다.');
          navigate('/'); // 
        }, 1000);
      } else {
        alert('탈퇴 실패: ' + res.data.message);
      }
    } catch (error) {
      console.error('탈퇴 오류:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  // 탈퇴 완료 메시지 출력
  if (withdrawSuccess) {
    return (
      <div className="user-withdraw-complete">
        <h2>탈퇴가 완료되었습니다.</h2>
        <p>그동안 이용해 주셔서 감사합니다.</p>
      </div>
    );
  }

  return (
    <div className="user-address-form">
      <h2>회원 탈퇴</h2>

      {/* 기본 안내문 (처음 화면) */}
      {!showPrompt && (
        <>
          <p style={{ marginBottom: '5px' }}>탈퇴 하시겠습니까?</p>
          <p style={{ marginTop: '0px', marginBottom: '20px', color: 'red' }}>
            탈퇴 시 같은 아이디 사용이 불가합니다.
          </p>
        </>
      )}

      {/* "회원 탈퇴하기" 버튼 */}
      {!showPrompt && (
        <button
          onClick={handleWithdrawClick}
          className="btn-withdraw"
          style={{ color: 'gray' }}
        >
          회원 탈퇴하기
        </button>
      )}

      {/* 탈퇴 확인 문구 표시되면 이 영역이 나타남 */}
      {showPrompt && (
        <div>
          <p style={{ marginBottom: '20px' }}>
            정말 탈퇴하시겠습니까? <br />
            <span style={{ color: 'red' }}>탈퇴 완료 시 복구가 불가능합니다.</span>
          </p>

          {/* "예" 텍스트 (작게 표시) */}
          <p
            onClick={handleFirstYesClick}
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
              color: 'black',
              marginBottom: '10px',
              display: 'inline-block'
            }}
          >
            예
          </p>

          {/* "아니오" 버튼 (btn-edit 스타일) */}
          <button 
          className="btn-edit" 
          onClick={handleCancel}
          style={{cursor: 'pointer'}}>
            아니오
          </button>
        </div>
      )}

      {/* 최종 모달 알림창 (혜택 사라짐 경고) */}
      {showFinalModal && (
        <Modal
          visible={true}
          message={
            <>
              탈퇴 시 모든 회원 혜택과 적립금이 사라지며 <br />
              복구가 어렵습니다. <br />
              <strong>정말 탈퇴 하시겠습니까?</strong>
            </>
          }
          onConfirm={handleFinalConfirm}
          onCancel={() => setShowFinalModal(false)}
        />
      )}
    </div>
  );
};

export default UserWithdraw;
