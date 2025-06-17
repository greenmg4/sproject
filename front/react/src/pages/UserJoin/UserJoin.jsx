import React, { useState } from 'react'; 
import axios from 'axios';
import DaumPostcode from 'react-daum-postcode';
import '../../styles/User/UserAddressF.css';

const UserJoin = () => {

      const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8080';
  const [form, setForm] = useState({
    cust_id: '',
    password: '',
    cust_nm: '',
    phone: '',
    emailUser: '',
    emailDomain: '',
    emailDomainOther: '',
    zip: '',
    address1: '',
    address2: '',
    birthday: '',
    gender: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchMessage, setPasswordMatchMessage] = useState('');
  const [idCheckMessage, setIdCheckMessage] = useState('');
  const [idValid, setIdValid] = useState(false);
  
  // 새로 추가된 각 필드별 에러 메시지 상태
  const [passwordError, setPasswordError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [showAddress2, setShowAddress2] = useState(false);

      // 🔹 추가된 상태 (상단 useState 부분에 추가)
    const [addr_class, setAddrClass] = useState('01'); // 기본값 '집'

  const getEmail = () => {
    const domain = form.emailDomain === 'other' ? form.emailDomainOther : form.emailDomain;
    return form.emailUser && domain ? `${form.emailUser}@${domain}` : '';
  };

  const formatPhoneNumber = (input) => {
    const nums = input.replace(/\D/g, '').slice(0, 11);
    if (nums.length < 4) return nums;
    if (nums.length < 8) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'phone' ? formatPhoneNumber(value) : value,
    }));
    
    // 입력 시 해당 필드 오류 메시지 초기화
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
    if(name === 'password') setPasswordError('');
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatchMessage(
      form.password === value ? '✅ 비밀번호가 일치합니다.' : '❌ 비밀번호가 일치하지 않습니다.'
    );
  };

  // 아이디 유효성 + 숫자만 불가 검사, 중복 검사
  const handleIdBlur = async () => {
    const id = form.cust_id.trim();
    if (!id) {
      setIdValid(false);
      return setIdCheckMessage('❗ 아이디를 입력해주세요.');
    }

    // 숫자만으로 된 아이디는 불가
    if (/^\d+$/.test(id)) {
      setIdValid(false);
      return setIdCheckMessage('⛔ 아이디는 숫자만으로 만들 수 없습니다. 영문 포함 필수입니다.');
    }

    // 영문+숫자 1~20자만 가능
    const regex = /^[A-Za-z0-9]{1,20}$/;
    if (!regex.test(id)) {
      setIdValid(false);
      return setIdCheckMessage('⛔ 아이디는 영문+숫자 20자 이내만 가능합니다.');
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/user/check-id`, { cust_id: id });
      if (res.data.available) {
        setIdValid(true);
        setIdCheckMessage('✅ 사용 가능한 아이디입니다.');
      } else {
        setIdValid(false);
        setIdCheckMessage('❌ 이미 사용 중인 아이디입니다.');
      }
    } catch {
      setIdValid(false);
      setIdCheckMessage('❗ 아이디 확인 중 오류 발생');
    }
  };

  const handlePostcodeComplete = (data) => {
    const fullAddress = `${data.address}${data.buildingName ? ` (${data.buildingName})` : ''}`;
    setForm((prev) => ({
      ...prev,
      zip: data.zonecode,
      address1: fullAddress,
    }));
    setIsPostcodeOpen(false);
    setShowAddress2(true);
  };

  const resetForm = () => {
    setForm({
      cust_id: '',
      password: '',
      cust_nm: '',
      phone: '',
      emailUser: '',
      emailDomain: '',
      emailDomainOther: '',
      zip: '',
      address1: '',
      address2: '',
      birthday: '',
      gender: '',
    });
    setConfirmPassword('');
    setPasswordMatchMessage('');
    setIdCheckMessage('');
    setIdValid(false);
    setPasswordError('');
    setFormErrors({});
    setIsPostcodeOpen(false);
    setShowAddress2(false);
  };

  // 비밀번호 유효성 검사 함수
  const validatePassword = (pw) => {
    if (pw.length < 8) return '비밀번호는 최소 8자 이상이어야 합니다.';
    if (!/[A-Za-z]/.test(pw) || !/[0-9]/.test(pw)) return '비밀번호는 영문과 숫자를 모두 포함해야 합니다.';
    return '';
  };

  // 제출 시 유효성 검사 및 에러 메시지 설정, alert 대신 화면에 메시지 노출
  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};

    if (!form.cust_id.trim()) errors.cust_id = '아이디를 입력해주세요.';
    else if (!idValid) errors.cust_id = '아이디 중복 확인이 필요합니다.';
    
    // 비밀번호 검사
    const pwError = validatePassword(form.password);
    if (pwError) errors.password = pwError;
    if (form.password !== confirmPassword) errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    
    if (!form.cust_nm.trim()) errors.cust_nm = '이름을 입력해주세요.';
    if (!form.phone.trim()) errors.phone = '전화번호를 입력해주세요.';
    if (!form.emailUser.trim()) errors.emailUser = '이메일을 입력해주세요.';
    if (!form.emailDomain.trim()) errors.emailDomain = '이메일 도메인을 선택해주세요.';
    if (!form.birthday.trim()) errors.birthday = '생일을 입력해주세요.';
    if (!form.gender.trim()) errors.gender = '성별을 선택해주세요';
    

    setPasswordError(errors.password || '');
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return; // 오류 있으면 제출 중단



    const payload = {
      cust_id: form.cust_id,
      password: form.password,
      cust_nm: form.cust_nm,
      phone: form.phone,
      email: getEmail(),
      zip: form.zip,
      address1: form.address1,
      address2: form.address2,
      birthday: form.birthday,
      gender: form.gender,
      addr_class: addr_class // ✅ addr_class 추가 전달 (주소지 구분)
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/api/user/join`, payload);
      const { success, message } = res.data;
      if (success) {
        alert(`🎉 ${message}`);
        resetForm();
        window.location.href = '/login';
      } else {
        alert(`❌ 가입 실패: ${message}`);
      }
    } catch {
      alert('❗ 서버 오류로 가입 처리 실패했습니다.');
    }
  };

  return (
    <div className="user-address-form">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* 아이디 */}
        <div className="form-group">
          <label>아이디</label>
          <input
            name="cust_id"
            value={form.cust_id}
            onChange={handleChange}
            onBlur={handleIdBlur}
            placeholder="영문+숫자 최대 20자"
          />
          {idCheckMessage && (
            <p style={{ color: idValid ? 'green' : 'red' }}>{idCheckMessage}</p>
          )}
          {formErrors.cust_id && <p style={{ color: 'red' }}>{formErrors.cust_id}</p>}
        </div>

        {/* 비밀번호 + 확인 */}
        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호"
          />
          {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        </div>
        <div className="form-group">
          <label>비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="비밀번호 확인"
          />
          {passwordMatchMessage && (
            <p style={{ color: passwordMatchMessage.startsWith('✅') ? 'green' : 'red' }}>
              {passwordMatchMessage}
            </p>
          )}
          {formErrors.confirmPassword && <p style={{ color: 'red' }}>{formErrors.confirmPassword}</p>}
        </div>

        {/* 이름, 생일, 성별 */}
        <div className="form-group">
          <label>이름</label>
          <input
            name="cust_nm"
            value={form.cust_nm}
            onChange={handleChange}
            placeholder="이름"
          />
          {formErrors.cust_nm && <p style={{ color: 'red' }}>{formErrors.cust_nm}</p>}
        </div>
        <div className="form-group">
          <label>생일</label>
          <input type="date" name="birthday" value={form.birthday} onChange={handleChange} />
          {formErrors.birthday && <p style={{ color: 'red' }}>{formErrors.birthday}</p>}
        </div>
        <div className="form-group">
          <label>성별</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">성별 선택</option>
            <option value="1">남자</option>
            <option value="2">여자</option>
          </select>
          {formErrors.gender && <p style={{ color: 'red' }}>{formErrors.gender}</p>}
        </div>

        {/* 전화번호 */}
        <div className="form-group">
          <label>전화번호</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="핸드폰번호(필수)"
          />
          {formErrors.phone && <p style={{ color: 'red' }}>{formErrors.phone}</p>}
        </div>

        {/* 이메일 */}
        <div className="form-group">
          <label>이메일</label>
          <div style={{ display: 'flex' }}>
            <input
              name="emailUser"
              value={form.emailUser}
              onChange={handleChange}
              placeholder="이메일"
            />@
            <select
              name="emailDomain"
              value={form.emailDomain}
              onChange={handleChange}
            >
              <option value="">선택</option>
              <option value="naver.com">naver.com</option>
              <option value="daum.net">daum.net</option>
              <option value="gmail.com">gmail.com</option>
              <option value="other">직접입력</option>
            </select>
            {form.emailDomain === 'other' && (
              <input
                name="emailDomainOther"
                value={form.emailDomainOther}
                onChange={handleChange}
                placeholder="직접입력"
              />
            )}
          </div>
          {(formErrors.emailUser || formErrors.emailDomain) && (
            <p style={{ color: 'red' }}>
              {formErrors.emailUser || formErrors.emailDomain}
            </p>
          )}
        </div>

        {/* 주소 검색 */}
        <div className="form-group address1-group">
          <label>주소</label>
          <div style={{ position: 'relative' }}>
            <input
              name="address1"
              value={form.address1 ? `[${form.zip}] ${form.address1}` : ''}
              readOnly
              placeholder="주소를 검색해주세요"
            />
            <span
              style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                color: 'blue',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
              onClick={() => setIsPostcodeOpen(true)}
            >
              주소 검색
            </span>
          </div>
        </div>

        {isPostcodeOpen && (
          <div className="postcode-container">
            <DaumPostcode onComplete={handlePostcodeComplete} autoClose animation />
          </div>
        )}

        {showAddress2 && (
          <div className="form-group">
            <input
              name="address2"
              value={form.address2}
              onChange={handleChange}
              placeholder="상세주소 입력"
            />
          </div>
        )}

         {/* ▶ 추가된 주소지 구분 셀렉트 — showAddress2 기준으로만 노출 */}
        {showAddress2 && (
          <div className="form-group">
              <label>주소지 구분</label>
              <select
                name="addr_class"
                value={addr_class}
                onChange={(e) => setAddrClass(e.target.value)}
                required
              >
                <option value="01">집</option>
                <option value="02">회사</option>
                <option value="03">지인</option>
              </select>
            {formErrors.addr_class && (
              <p style={{ color: 'red' }}>{formErrors.addr_class}</p>
            )}
          </div>
        )}


        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default UserJoin;
