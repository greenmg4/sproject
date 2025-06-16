import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductPage.css';


export default function ProductPage() {
  const navigate = useNavigate();

  /* ---------- 상태 ---------- */
  const [products,      setProducts]      = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [searchType,    setSearchType]    = useState('all');
  const [searchText,    setSearchText]    = useState('');

  /* ---------- 관리자 체크 + 초기 로드 ---------- */
  useEffect(() => {
    axios
      .get(`/api/cust/admincheck`, { withCredentials: true })
      .then(() => init())                              // 통과 시 데이터 로드
      .catch(() => {
        alert('관리자 권한 없음');
        navigate('/', { replace: true });
      });

    function init() {
      axios
        .get(`/api/product/page`, { withCredentials: true })
        .then(res => setProducts(res.data))
        .catch(err => console.error('상품 조회 실패:', err));

      axios
        .get(`/api/product/productimage`, { withCredentials: true })
        .then(res => setProductImages(res.data))
        .catch(err => console.error('상품 이미지 조회 실패:', err));
    }
  }, [navigate]);

  /* ---------- 검색 ---------- */
  const searchProducts = () => {
    const searchCond = {
      prod_nm:   searchType === 'all'    ? searchText : null,
      author_nm: searchType === 'author' ? searchText : null,
    };

    axios
      .post(`/api/product/proList`, searchCond, { withCredentials: true })
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error('검색 실패:', err);
        alert('검색 중 오류가 발생했습니다.');
      });
  };

  /* ---------- 상품 삭제 ---------- */
  const productDelete = prod_no => {
    if (!window.confirm('해당 상품을 삭제하시겠습니까?')) return;

    axios
      .delete(`/api/product/delete`, {
        params: { prodNo: prod_no },
        withCredentials: true,
      })
      .then(() => {
        alert('삭제되었습니다.');
        window.location.reload();
      })
      .catch(err => {
        alert('삭제에 실패했습니다.');
        console.error(err);
      });
  };

  /* ---------- 기타 유틸 ---------- */
  const getImageByProdNo = prod_no => {
    const img = productImages.find(i => i.prod_no === prod_no);
    return img ? `/${img.img_path}` : null;
  };

  const goToUpdateProductPage = prod_no => navigate(`/product/update/${prod_no}`);

  const getCategoryName = code => ({
    '01': '소설', '02': '에세이', '03': '인문', '04': '요리', '05': '건강',
    '06': '정치', '07': '종교', '08': '과학', '09': '외국어', '10': 'IT',
  }[code] || '기타');

  /* ---------- 렌더 ---------- */
  return (
    <div className="product-page-container">
      <h2>📚 상품 목록</h2>

      {/* 검색 바 */}
      <div className="product-search-bar">
        <select value={searchType} onChange={e => setSearchType(e.target.value)}>
          <option value="all">통합검색</option>
          <option value="author">저자 검색</option>
        </select>
        <input
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && searchProducts()}
          placeholder="검색어를 입력하세요"
        />
        <button onClick={searchProducts}>검색</button>
      </div>

      {/* 상품 카드 그리드 */}
      <div className="product-grid">
        {products.map(p => (
          <div className="product-card" key={p.prod_no}>
            {getImageByProdNo(p.prod_no) && (
              <img src={getImageByProdNo(p.prod_no)} alt="상품" className="product-image" />
            )}

            <div className="product-info">
              <strong>{p.prod_nm}</strong><br />
              가격: {p.prod_price}원<br />
              저자: {p.author_nm}<br />
              카테고리: {getCategoryName(p.category)}<br />
              재고: {p.prod_cnt}<br />
              상태: {p.status === '1' ? '판매중' : '판매종료'}<br />
              출판사: {p.publisher}<br />
              등록일: {p.reg_dtm}<br />
              수정일: {p.upd_dtm || '없음'}<br />
              설명: {p.book_desc}
            </div>

            <div className="product-actions">
              <button onClick={() => goToUpdateProductPage(p.prod_no)}>상품 수정</button>
              <button onClick={() => productDelete(p.prod_no)}>상품 삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
