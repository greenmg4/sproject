import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DaumPostcode from 'react-daum-postcode';
import { useNavigate } from 'react-router-dom';
import '../styles/User/UserAddressF.css';

const UserEdit = ({ loginInfo, isLoggedIn }) => {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const [form, setForm] = useState({
    cust_id: '',
    cust_pw: '',
    cust_nm: '',
    birthday: '',
    phone: '',
    emailUser: '',
    emailDomain: '',
    emailDomainOther: '',
    zip: '',
    address1: '',
    address2: '',
    addr_class: '',
    rcv_nm: '',
    rcv_phone: ''
  });

  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [showAddress2, setShowAddress2] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isDomainSelectOpen, setIsDomainSelectOpen] = useState(false); // 직접입력 시 도메인 선택창 열림 여부

  const goToPassword = () => {
    navigate("/passwordcheck");
  };


  useEffect(() => {
    if (!loginInfo) return
    if (!loginInfo || !loginInfo.cust_id) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    axios.post(`${API_BASE_URL}/api/user/info`, { cust_id: loginInfo.cust_id })
      .then(res => {
        if (res.data && res.data.cust_id) {
          const [user, domain] = res.data.email?.split('@') || ['', ''];
          setForm(prev => ({
            ...prev,
            ...res.data,
            emailUser: user,
            emailDomain: domain,
            rcv_nm: res.data.cust_nm,
            rcv_phone: res.data.phone
          }));
          if (res.data.address2?.trim()) setShowAddress2(true);
        } else {
          alert("사용자 정보를 불러올 수 없습니다.");
        }
      })
      .catch(err => {
        console.error("유저 정보 불러오기 실패:", err);
        alert("서버 오류로 사용자 정보를 가져오지 못했습니다.");
      });
  }, [loginInfo, navigate]);

  const formatPhoneNumber = (input) => {
    const nums = input.replace(/\D/g, '').slice(0, 11);
    if (nums.length < 4) return nums;
    if (nums.length < 8) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
  };

  const toggleDomainSelect = () => {
  setIsDomainSelectOpen(prev => !prev);
};

//이메일
const handleDomainChange = (e) => {
  const value = e.target.value;
  if (value === 'other') {
    setForm(prev => ({ ...prev, emailDomain: 'other', emailDomainOther: '' }));
  } else {
    setForm(prev => ({ ...prev, emailDomain: value, emailDomainOther: '' }));
  }
  setIsDomainSelectOpen(false);
};

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'phone' || name === 'rcv_phone') newValue = formatPhoneNumber(value);
    setForm(prev => ({ ...prev, [name]: newValue }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePostcodeComplete = (data) => {
    const extraAddress = data.buildingName ? ` (${data.buildingName})` : '';
    const fullAddress = `[${data.zonecode}] ${data.address}${extraAddress}`;
    setForm(prev => ({
      ...prev,
      zip: data.zonecode,
      address1: fullAddress
    }));
    setIsPostcodeOpen(false);
    setShowAddress2(true);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    let errors = {};

    if (!form.cust_nm.trim()) errors.cust_nm = '이름은 필수입니다';
    if (!form.phone.trim() || !/^\d{3}-\d{4}-\d{4}$/.test(form.phone)) errors.phone = '전화번호를 확인하세요';

    const email = `${form.emailUser}@${form.emailDomain === 'other' ? form.emailDomainOther : form.emailDomain}`;
    if (!form.emailUser.trim()) errors.emailUser = '이메일 앞부분을 입력하세요';
    if (!(form.emailDomain.trim() || form.emailDomainOther.trim())) errors.emailDomain = '이메일 도메인을 선택하거나 입력하세요';
    if (!validateEmail(email)) errors.emailUser = '이메일 형식이 올바르지 않습니다';

    if (!form.rcv_nm.trim()) errors.rcv_nm = '수신자 이름은 필수입니다';
    if (!form.rcv_phone.trim() || !/^\d{3}-\d{4}-\d{4}$/.test(form.rcv_phone)) errors.rcv_phone = '수신자 전화번호를 확인하세요';

    if (form.addr_class && (!form.zip || !form.address1)) {
      errors.addr_class = '주소 분류 선택 시 주소 입력도 필요합니다';
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    axios.post(`${API_BASE_URL}/api/user/update`, {
      ...form,
      email: email
    })
      .then(() => {
        alert("수정 완료되었습니다.");
        navigate("/userinfo");
      })
      .catch(err => {
        console.error("수정 실패:", err);
        alert("정보 수정 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="user-address-form">
      <h2 className="form-title">내정보 수정</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>아이디</label>
          <input type="text" name="cust_id" value={form.cust_id} disabled />
        </div>

        <div className="form-group">
          <label>이름</label>
          <input type="text" name="cust_nm" value={form.cust_nm} onChange={handleChange} />
          {formErrors.cust_nm && <p style={{ color: 'red' }}>{formErrors.cust_nm}</p>}
        </div>

        <div className="form-group">
          <label>생년월일</label>
          <input type="date" name="birthday" value={form.birthday} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>전화번호</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} />
          {formErrors.phone && <p style={{ color: 'red' }}>{formErrors.phone}</p>}
        </div>

        <div className="form-group">
          <label>이메일</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {/* 이메일 앞부분 */}
            <input
              name="emailUser"
              value={form.emailUser}
              onChange={handleChange}
              placeholder="이메일 아이디"
              style={{ flex: 1 }}
            />
            <span>@</span>

            {/* 직접입력일 때 */}
            {form.emailDomain === 'other' ? (
              <div style={{ position: 'relative', flex: 1 }}>
                {/* 직접입력 도메인 input */}
                <input
                  name="emailDomainOther"
                  value={form.emailDomainOther}
                  onChange={handleChange}
                  placeholder="도메인 입력"
                  style={{ width: '100%', paddingRight: '25px' }} // 화살표 공간 확보
                />
                {/* 화살표 아이콘 (select 스타일 느낌) */}
                <div className='emailselect'
                  onClick={toggleDomainSelect}
                  style={{
                    position: 'absolute',
                    right: '5px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    userSelect: 'none',
                  }}
                >
                  ▼
                </div>

                {/* 도메인 선택창 (토글 시 보여줌) */}
                {isDomainSelectOpen && (
                  <select
                    value={form.emailDomain}
                    onChange={handleDomainChange}
                    size={4}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: '100%',
                      zIndex: 10,
                    }}
                  >
                    <option value="">선택</option>
                    <option value="naver.com">naver.com</option>
                    <option value="daum.net">daum.net</option>
                    <option value="gmail.com">gmail.com</option>
                    <option value="other">직접입력</option>
                  </select>
                )}
              </div>
            ) : (
              // 직접입력 아닌 일반 select
              <select
                name="emailDomain"
                value={form.emailDomain}
                onChange={handleChange}
                style={{ flex: 1 }}
              >
                <option value="">선택</option>
                <option value="naver.com">naver.com</option>
                <option value="daum.net">daum.net</option>
                <option value="gmail.com">gmail.com</option>
                <option value="other">직접입력</option>
              </select>
            )}
          </div>

          {(formErrors.emailUser || formErrors.emailDomain) && (
            <p style={{ color: 'red' }}>{formErrors.emailUser || formErrors.emailDomain}</p>
          )}
        </div>




        <div className="form-group">
          <label>수신자 이름</label>
          <input type="text" name="rcv_nm" value={form.rcv_nm} onChange={handleChange} />
          {formErrors.rcv_nm && <p style={{ color: 'red' }}>{formErrors.rcv_nm}</p>}
        </div>

        <div className="form-group">
          <label>수신자 전화</label>
          <input type="text" name="rcv_phone" value={form.rcv_phone} onChange={handleChange} />
          {formErrors.rcv_phone && <p style={{ color: 'red' }}>{formErrors.rcv_phone}</p>}
        </div>

        <div className="form-group">
          <label>주소</label>
          <div className="address-search-container">
            <input type="text" name="address1" value={form.address1} placeholder="주소 검색" onClick={() => setIsPostcodeOpen(true)} readOnly />
            <input type="text" name="zip" value={form.zip} readOnly placeholder="우편번호" />
          </div>
        </div>

        {showAddress2 && (
          <>
            <div className="form-group">
              <label>상세 주소</label>
              <input type="text" name="address2" value={form.address2} onChange={handleChange} placeholder="상세 주소를 입력해주세요" />
            </div>

            <div className="form-group">
              <label>주소 분류</label>
              <select name="addr_class" value={form.addr_class} onChange={handleChange}>
                <option value="">-- 주소 분류 선택 --</option>
                <option value="01">집</option>
                <option value="02">회사</option>
                <option value="03">지인</option>
              </select>
              {formErrors.addr_class && <p style={{ color: 'red' }}>{formErrors.addr_class}</p>}
            </div>
          </>
        )}

        {isPostcodeOpen && (
          <div className="postcode-popup">
            <DaumPostcode onComplete={handlePostcodeComplete} autoClose />
          </div>
        )}

        <div>
          <button type="submit" className="btn-edit" style={{ cursor: 'pointer' }}>
            내정보 수정하기
          </button>
          <button type="button" onClick={goToPassword} className="btn-password" style={{ cursor: 'pointer' }}>
            비밀번호 수정하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEdit;
