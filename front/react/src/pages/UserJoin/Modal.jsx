import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 모달창 컴포넌트
 * - `visible`이 true일 때만 렌더링
 * - `message`는 내용
 * - `onConfirm`: "예" 텍스트 클릭 시 실행
 * - `onCancel`: "아니오" 버튼 클릭 시 실행
 */
const Modal = ({ visible, message, onConfirm, onCancel }) => {
  const navigate = useNavigate();
  const goToUserInfo = () => {
        navigate("/userinfo");
    };
  if (!visible) return null; // 안 보일 때는 렌더링하지 않음

  return (
    <>
      {/* 어두운 배경 */}
      <div style={styles.overlay} />

      {/* 모달 본체 */}
      <div style={styles.modal}>
        {/* 메시지 영역 */}
        <div style={styles.message}>{message}</div>

        {/* "예" 텍스트 */}
        <p
          onClick={onConfirm}
          style={styles.confirmText}
        >
          예
        </p>

        {/* "아니오" 버튼 */}
        <button
          onClick={goToUserInfo}
          style={styles.cancelButton}
        >
          아니오
        </button>
      </div>
    </>
  );
};

// 스타일 정의
const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  modal: {
    position: 'fixed',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '40px 30px',          // 모달창 padding 늘림
    width: '350px',                // 넓이 조정
    borderRadius: 10,
    zIndex: 1001,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    textAlign: 'center',
  },
  message: {
    fontSize: '16px',              // 메시지 폰트 크기 조절
    marginBottom: '30px',
    lineHeight: 1.6,
  },
  confirmText: {
    textDecoration: 'underline',
    cursor: 'pointer',
    color: 'black',
    fontSize: '16px',
    marginBottom: '16px',
    display: 'inline-block'
  },
  cancelButton: {
    backgroundColor: 'black',
    color: 'white',
    padding: '12px 20px',
    width: '100%',
    fontSize: '16px',
    border: '1px solid black',
    borderRadius: '6px',
    marginBottom: '10px',
    cursor: 'pointer',
  }
};

export default Modal;
