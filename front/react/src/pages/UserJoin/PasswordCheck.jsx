import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function PasswordCheck({ loginInfo }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await axios.post("/cust/password/check", {
        cust_id: loginInfo?.cust_id,
        currentPassword
      });
      if (res.data === true) {
        navigate("/password-change");
      } else {
        setError("현재 비밀번호가 일치하지 않습니다.");
      }
    } catch (err) {
      setError("오류 발생: " + err.message);
    }
  };

  return (
    <div>
      <h2>현재 비밀번호 확인</h2>
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="현재 비밀번호"
      />
      <button onClick={handleSubmit}>확인</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default PasswordCheck;
