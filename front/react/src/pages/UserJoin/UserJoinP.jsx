import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/UserJoinP.css'; // 스타일 분리




const UserJoinP = () => {
  const navigate = useNavigate();

  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    personalRequired: false,
    personalOptional: false,
    ads: false,
  });

  const handleCheckboxChange = (key) => {
    const newAgreements = {
      ...agreements,
      [key]: !agreements[key],
    };

    // 전체 동의 버튼 상태 재설정
    if (
      key !== 'all' &&
      newAgreements.terms &&
      newAgreements.personalRequired &&
      newAgreements.personalOptional &&
      newAgreements.ads
    ) {
      newAgreements.all = true;
    } else if (key !== 'all') {
      newAgreements.all = false;
    }

    setAgreements(newAgreements);
  };

  const handleAllAgree = () => {
    const newState = !agreements.all;
    setAgreements({
      all: newState,
      terms: newState,
      personalRequired: newState,
      personalOptional: newState,
      ads: newState,
    });
  };

  const canProceed = agreements.terms && agreements.personalRequired;

  const goToJoin = () => {
    if (canProceed) {
      navigate('/userjoin'); // Userjoin.jsx 경로
    } else {
      alert('필수 약관에 동의해 주세요.');
    }
  };

  return (
    <div className="join-container">
      <h2>이용약관 동의</h2>

      <div className="agreement-box">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={agreements.all}
            onChange={handleAllAgree}
          />
          <span className="checkmark"></span>
          전체 동의합니다
        </label>
      </div>
      <br/>

      <div className="terms-box">
        <span className="checkmark"></span>
          이용약관에 동의합니다 (필수)
          <input
            type="checkbox"
            checked={agreements.terms}
            onChange={() => handleCheckboxChange('terms')}
          /> 
          <br/>
        <textarea readOnly value={`[이용약관] 여기에 약관 내용을 삽입합니다...`} />
        <label className="checkbox-container"><br/><br/>
          
          
        </label>
      </div>

      <div className="agreement-box">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={agreements.personalRequired}
            onChange={() => handleCheckboxChange('personalRequired')}
          />
          <span className="checkmark"></span>
          개인정보 수집∙이용에 동의합니다 (필수)
        </label><br/><br/>

        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={agreements.personalOptional}
            onChange={() => handleCheckboxChange('personalOptional')}
          />
          <span className="checkmark"></span>
          개인정보 수집∙이용에 동의합니다 (선택)
        </label><br/><br/>

        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={agreements.ads}
            onChange={() => handleCheckboxChange('ads')}
          />
          <span className="checkmark"></span>
          광고성 정보 수신에 동의합니다 (선택)
        </label>
      </div><br/>

      <button
        className="agree-button"
        onClick={goToJoin}
        disabled={!canProceed}
      >
        동의하고 회원가입
      </button>
    </div>
  );
};

export default UserJoinP;


