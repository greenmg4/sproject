import React, { useState } from 'react';
import axios from 'axios';
import DaumPostcode from 'react-daum-postcode';

const UserJoin = () => {
  const [form, setForm] = useState({
    cust_id: '',
    password: '',
    cust_nm: '',
    phone: '',
    email: '',
    zip: '',
    address1: '',
    address2: '',
    birthday: '',
    gender: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchMessage, setPasswordMatchMessage] = useState('');
  const [idCheckMessage, setIdCheckMessage] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

// 🔢 전화번호 숫자만 입력 + 자동 하이픈
  const formatPhoneNumber = (input) => {
    const onlyNums = input.replace(/\D/g, '').slice(0, 11); // 숫자만 추출, 최대 11자리
    if (onlyNums.length < 4) return onlyNums;
    if (onlyNums.length < 8) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      setForm({ ...form, [name]: formatPhoneNumber(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatchMessage(
      form.password !== value ? '❌ 비밀번호가 일치하지 않습니다.' : '✅ 비밀번호가 일치합니다.'
    );
  };

  const handleIdCheck = async () => {
    if (!form.cust_id) {
      setIdCheckMessage('❗ 아이디를 입력해주세요.');
      return;
    }
    try {
      const response = await axios.post('/api/user/check-id', { cust_id: form.cust_id });
      if (response.data.available) {
        setIsIdChecked(true);
        setIdCheckMessage('✅ 사용 가능한 아이디입니다.');
      } else {
        setIsIdChecked(false);
        setIdCheckMessage('❌ 이미 사용 중인 아이디입니다.');
      }
    } catch (error) {
      console.error('아이디 중복 확인 오류:', error);
      setIdCheckMessage('❗ 중복 확인 중 오류 발생.');
    }
  };

  const handlePostcodeComplete = (data) => {
    setForm(prev => ({
      ...prev,
      zip: data.zonecode,
      address1: data.address,
    }));
    setIsPostcodeOpen(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isIdChecked) {
    alert('아이디 중복 확인을 해주세요.');
    return;
  }

  if (form.password !== confirmPassword) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  try {
    const response = await axios.post('/api/user/join', form);
    
    // 🔧 JSON 객체로부터 success와 message 추출
    const { success, message } = response.data;

    if (success) {
      alert('🎉 ' + message); // ex: 회원가입이 완료되었습니다.
      window.location.href = '/login';
    } else {
      alert('❌ 회원가입 실패: ' + message); // ex: 이미 존재하는 아이디입니다.
    }

  } catch (error) {
    console.error('회원가입 오류:', error);
    alert('❗ 회원가입 중 오류가 발생했습니다.');
  }
};

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
        <div>
          <input
            name="cust_id"
            value={form.cust_id}
            onChange={handleChange}
            placeholder="아이디"
            required
            style={{ width: '100%' }}
          />
          <button type="button" onClick={handleIdCheck} style={{ marginTop: '5px' }}>중복 확인</button>
          <div style={{ color: 'gray' }}>{idCheckMessage}</div>
        </div>

        <div>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="비밀번호 확인"
            required
            style={{ width: '100%' }}
          />
          <div style={{ color: 'gray' }}>{passwordMatchMessage}</div>
        </div>

        <div>
          <input
            name="cust_nm"
            value={form.cust_nm}
            onChange={handleChange}
            placeholder="이름"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <input
            type="date"
            name="birthday"
            value={form.birthday}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label>성별</label><br />
          <label>
            <input
              type="radio"
              name="gender"
              value="1"
              checked={form.gender === '1'}
              onChange={handleChange}
              required
            /> 남자
          </label>
          <label style={{ marginLeft: '20px' }}>
            <input
              type="radio"
              name="gender"
              value="2"
              checked={form.gender === '2'}
              onChange={handleChange}
              required
            /> 여자
          </label>
        </div>

        <div>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="전화번호"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="이메일"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <input
            name="zip"
            value={form.zip}
            readOnly
            placeholder="우편번호"
            style={{ width: '100%' }}
          />
          <button type="button" onClick={() => setIsPostcodeOpen(true)} style={{ marginTop: '5px' }}>
            우편번호 검색
          </button>
        </div>

        <div>
          <input
            name="address1"
            value={form.address1}
            readOnly
            placeholder="주소"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <input
            name="address2"
            value={form.address2}
            onChange={handleChange}
            placeholder="상세주소"
            style={{ width: '100%' }}
          />
        </div>

        {isPostcodeOpen && (
          <DaumPostcode
            onComplete={handlePostcodeComplete}
            autoClose
            style={{ width: '100%', height: '500px' }}
          />
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button type="submit">회원가입</button>
        </div>
      </form>
    </div>
  );
};

export default UserJoin;