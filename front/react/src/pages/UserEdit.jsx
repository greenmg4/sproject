import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/User/UserAddress.css'

const UserEdit = ({ loginInfo, isLoggedIn }) => {
  const navigate = useNavigate();

  // 사용자 정보 form 상태 초기화
  const [form, setForm] = useState({
    cust_id: '',
    cust_pw: '',
    cust_nm: '',
    birthday: '',
    phone: '',
    email: '',
    zip: '',
    address1: '',
    address2: ''
  });
  // 비밀번호 수정 
  const goToPassword = () => {
    navigate("/passwordcheck");
  }
  // 로그인 여부 확인 및 사용자 정보 불러오기
  useEffect(() => {
    // loginInfo가 없거나 cust_id가 없으면 로그인 페이지로 이동
    if (!loginInfo || !loginInfo.cust_id) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    // 사용자 정보 요청
    axios.post('/api/user/info', { cust_id: loginInfo.cust_id }, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        console.log("서버 응답:", res);
        if (res.data && res.data.cust_id) {
          setForm(res.data);
        } else {
          console.warn("서버 응답에 사용자 정보가 없습니다:", res.data);
          alert("사용자 정보를 불러올 수 없습니다.");
        }
      })
      .catch(err => {
        console.error("유저 정보 불러오기 실패:", err);
        alert("서버로부터 사용자 정보를 받아오는 데 실패했습니다.");
      });
  }, [loginInfo, navigate]);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  // 수정 완료 시 서버에 사용자 정보 업데이트 요청
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('/api/user/update', form, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        alert("수정 완료되었습니다.");
        navigate("/userinfo"); // 수정 후 내정보 페이지로 이동
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
          <input type="date" name="birthday" value={form.birthday} onChange={handleChange} />
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
          주소1:
          <input type="text" name="address1" value={form.address1} onChange={handleChange} />
        </label>
        <br />
        <label>
          주소2:
          <input type="text" name="address2" value={form.address2} onChange={handleChange} />
        </label>
        <br />
        <label>
          우편번호:
          <input type="text" name="zip" value={form.zip} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">수정하기</button>
        <button type="button" variant="outline"  onClick={goToPassword} style={{ marginLeft: "10px" }}>
        비밀번호 수정하기
        </button>
      </form>
    </div>
  );
};

export default UserEdit;
