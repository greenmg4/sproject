import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function PasswordChange() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (pw) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{8,}$/;
    return regex.test(pw);
  };

  const handleSubmit = async () => {
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!validatePassword(password)) {
      setError("비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.");
      return;
    }

    try {
      await axios.put("http://localhost:8080/api/cust/password/change", { newPassword: password },
        {withCredentials: true}
      );
      alert("비밀번호가 성공적으로 변경되었습니다.");
      navigate("/userinfo");
    } catch (err) {
      setError("비밀번호 변경 실패: " + err.message);
    }
  };

  return (
    <div className="user-address-form">
      <h2>새 비밀번호 설정</h2>
      <div className="form-group">
      <input
        type="password"
        placeholder="새 비밀번호 입력"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      </div>
      <div className="form-group">
      <input
        type="password"
        placeholder="새 비밀번호 확인"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
      />
      <br/>
      </div>
      <button onClick={handleSubmit} className="btn-edit">비밀번호 수정하기</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default PasswordChange;
