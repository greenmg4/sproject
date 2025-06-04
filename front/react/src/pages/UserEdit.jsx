import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserEdit = () => {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    cust_id: '',
    cust_pw: '',
    cust_nm: '',
    birth_dt: '',
    phone: '',
    email: '',
    zipcode: '',
    addr1: '',
    addr2: ''
  });

  // 로그인 여부 확인 및 정보 불러오기
  useEffect(() => {
  const cust_id = sessionStorage.getItem("loginID");
  console.log("UserEdit 페이지 cust_id (from sessionStorage):", cust_id);

  if (!cust_id) {
    alert("로그인이 필요합니다.");
    navigate("/login");
    return;
  }

  // axios 요청 시작
  axios.post('/api/user/info', { cust_id }, {
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => {
      console.log("서버 응답:", res);

      if (res.data && res.data.cust_id) {
        setForm(res.data);
      } else {
        console.warn("서버 응답에 데이터 없음:", res.data);
        alert("사용자 정보가 비어 있습니다.");
      }
    })
    .catch(err => {
      console.error("axios 요청 실패:", err);
      alert("서버로부터 사용자 정보를 받아오는 데 실패했습니다.");
    });
}, [navigate]);


  // 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  // 수정 완료 시 백엔드에 요청
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('/api/user/update', form, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        alert("수정 완료되었습니다.");
        navigate("/userinfo"); // 내 정보 페이지로 이동
      })
      .catch(err => {
        console.error("수정 실패", err);
        alert("수정 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="user-edit-container">
      <h2>내정보 수정</h2>
      <form onSubmit={handleSubmit}>
        <label>
          아이디:
          <input type="text" name="cust_id" value={form.cust_id} disabled />
        </label>
        <br />
        <label>
          이름:
          <input type="text" name="cust_nm" value={form.cust_nm} onChange={handleChange} />
        </label>
        <br />
        <label>
          비밀번호:
          <input type="password" name="cust_pw" value={form.cust_pw} onChange={handleChange} />
        </label>
        <br />
        <label>
          생년월일:
          <input type="date" name="birth_dt" value={form.birth_dt} onChange={handleChange} />
        </label>
        <br />
        <label>
          전화번호:
          <input type="text" name="phone" value={form.phone} onChange={handleChange} />
        </label>
        <br />
        <label>
          이메일:
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </label>
        <br />
        <label>
          주소:
          <input type="text" name="addr1" value={form.addr1} onChange={handleChange} />
        </label>
        <br />
        <label>
          우편번호:
          <input type="text" name="zipcode" value={form.zip} onChange={handleChange} />
        </label>
        <br />
        <label>
          상세주소:
          <input type="text" name="addr2" value={form.addr2} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">수정하기</button>
      </form>
    </div>
  );
};

export default UserEdit;
