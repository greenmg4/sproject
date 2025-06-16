import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductUpload.css';

const BASE_URL = 'http://localhost:8080';

export default function ProductUpload() {
  const navigate = useNavigate();

  /* ---------- 상태 ---------- */
  const [product, setProduct] = useState({
    prod_nm: '', prod_price: 0, category: '01', status: '1',
    prod_cnt: 0, publisher: '', author_nm: '', book_desc: '',
    suggest_yn: 'N'
  });
  const [imageFile, setImageFile] = useState(null);
  const [img_class, setImgClass]  = useState('01');

  /* ---------- 관리자 체크 ---------- */
  useEffect(() => {
    axios
      .get(`${BASE_URL}/cust/admincheck`, { withCredentials: true })
      .catch(() => {
        alert('관리자 권한 없음');
        navigate('/', { replace: true });
      });
  }, [navigate]);

  /* ---------- 입력 핸들러 ---------- */
  const handleChange     = e => setProduct({ ...product, [e.target.name]: e.target.value });
  const handleFileChange = e => setImageFile(e.target.files[0]);

  /* ---------- 업로드 ---------- */
  const handleSubmit = async e => {
    e.preventDefault();
    if (!imageFile) return alert('이미지를 선택해주세요');

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('imgClass', img_class);
    formData.append('product', JSON.stringify(product));

    try {
      await axios.post(
        `${BASE_URL}/product/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
      );
      alert('상품 등록 성공!');
      navigate('/product');
    } catch (err) {
      console.error(err);
      alert('상품 등록 실패');
    }
  };

  /* ---------- 렌더 ---------- */
  return (
    <div className="product-upload-container" style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>📦 상품 등록</h2>
      <form onSubmit={handleSubmit}>
        {/* 상품명 */}
        <div className="form-group">
          <label>상품명</label>
          <input name="prod_nm" onChange={handleChange} required />
        </div>

        {/* 가격 */}
        <div className="form-group">
          <label>가격</label>
          <input name="prod_price" type="number" onChange={handleChange} required />
        </div>

        {/* 카테고리 */}
        <div className="form-group">
          <label>카테고리</label>
          <select name="category" onChange={handleChange}>
            <option value="01">소설</option><option value="02">에세이</option>
            <option value="03">인문</option><option value="04">요리</option>
            <option value="05">건강</option><option value="06">정치</option>
            <option value="07">종교</option><option value="08">과학</option>
            <option value="09">외국어</option><option value="10">IT</option>
          </select>
        </div>

        {/* 판매 상태 */}
        <div className="form-group">
          <label>판매 상태</label>
          <select name="status" onChange={handleChange}>
            <option value="1">판매중</option>
            <option value="2">판매종료</option>
          </select>
        </div>

        {/* 재고수 */}
        <div className="form-group">
          <label>재고수</label>
          <input name="prod_cnt" type="number" onChange={handleChange} required />
        </div>

        {/* 출판사 */}
        <div className="form-group">
          <label>출판사</label>
          <input name="publisher" onChange={handleChange} />
        </div>

        {/* 저자 */}
        <div className="form-group">
          <label>저자</label>
          <input name="author_nm" onChange={handleChange} />
        </div>

        {/* 추천 여부 */}
        <div className="form-group">
          <label>추천 여부</label>
          <select name="suggest_yn" value={product.suggest_yn} onChange={handleChange}>
            <option value="N">일반도서</option>
            <option value="Y">추천도서</option>
          </select>
        </div>

        {/* 책 설명 */}
        <div className="form-group">
          <label>책 설명</label>
          <textarea name="book_desc" rows="5" onChange={handleChange} />
        </div>

        {/* 이미지 파일 */}
        <div className="form-group">
          <label>이미지</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* 이미지 구분 */}
        <div className="form-group">
          <label>이미지 구분</label>
          <select value={img_class} onChange={e => setImgClass(e.target.value)}>
            <option value="01">메인이미지</option>
            <option value="02">정면</option>
            <option value="03">상</option>
            <option value="04">하</option>
            <option value="05">좌</option>
            <option value="06">우</option>
          </select>
        </div>

        <button type="submit">등록</button>
      </form>
    </div>
  );
}
