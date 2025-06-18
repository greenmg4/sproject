import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PasswordCheck({ loginInfo }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // 엔터 눌렀을 때 페이지 새로고침 방지

    try {
      const res = await axios.post("http://localhost:8080/api/cust/password/check", {
        cust_id: loginInfo?.cust_id,
        password: currentPassword
      }, { withCredentials: true });

      console.log("서버 응답:", res.data);

      if (res.data.result === true) {
        navigate("/password-change");
      } else {
        setError("현재 비밀번호가 일치하지 않습니다.");
      }
    } catch (err) {
      console.error("비밀번호 확인 실패:", err.response?.data || err.message);
      setError("오류 발생: " + err.message);
    }
  };

  return (
    <div className="user-address-form">

    <form onSubmit={handleSubmit}>      
      <h2>현재 비밀번호 확인</h2>
      <div className="form-group">
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="현재 비밀번호"
      />
      </div>
      <button 
      type="submit"
      className="btn-edit"
      >확인</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
    </div>
  );
}

export default PasswordCheck;
