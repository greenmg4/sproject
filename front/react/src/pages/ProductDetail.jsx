import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ProDetail, addCart } from '../service/apiService';

export default function ProductDetail() {

  // 스타일 정의
  const selectStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  };

  const cartButtonStyle = {
    flex: 1,
    padding: '15px',
    fontSize: '16px',
    backgroundColor: '#ff4757',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  };

  const buyButtonStyle = {
    flex: 1,
    padding: '15px',
    fontSize: '16px',
    backgroundColor: '#2ed573',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  };

  const location = useLocation();
  const { prod_no } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(location.state || null);

  useEffect(() => {
    if (!product && prod_no) {
      ProDetail(prod_no)
        .then(data => setProduct(data))
        .catch(err => {
          console.error('상품 로딩 실패:', err);
          alert('상품 정보를 불러오는데 실패했습니다.');
        });
    }
  }, [prod_no, product]);

  const handleAddCart = async () => {
    const cust_id = sessionStorage.getItem("loginID");
    if (!cust_id) {
      alert("로그인 후 이용해 주세요.");
      return;
    }
    if (!product) {
      alert("상품 정보가 없습니다.");
      return;
    }

    try {
      await addCart({ cust_id, prod_no: product.prod_no, cnt: 1 });
      alert('장바구니에 상품이 추가되었습니다.');
      navigate('/cart/addCart');
    } catch (error) {
      console.error(error);
      alert('장바구니 추가에 실패했습니다.');
    }
  };

  if (!product) return <div>상품 정보를 불러오는 중입니다...</div>;

  const handleBuyNow = () => {
  const cust_id = sessionStorage.getItem("loginID");
    if (!cust_id) {
      alert("로그인 후 이용해 주세요.");
      return;
    }
    if (!product) {
      alert("상품 정보가 없습니다.");
      return;
    }

    // 결제 페이지로 상품 정보와 함께 이동
    navigate('/order/payment', { state: { product, cust_id, cnt: 1 } });
  };

  return (
    <div className="product-detail" style={{ padding: '20px', display: 'flex', gap: '30px' }}>
      {/* 이미지 영역 */}
      <div style={{ flex: '1' }}>
        <img
          src={product.img_path || '/images/recommendation/default-product.png'}
          alt={product.prod_nm}
          style={{ width: '100%', borderRadius: '8px' }}
        />
      </div>

      {/* 상품 정보 영역 */}
      <div style={{ flex: '1.2' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{product.prod_nm}</h2>
        <div style={{ margin: '10px 0', fontSize: '18px' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {product.prod_price?.toLocaleString()}원
          </span>
        </div>
        <div style={{ marginTop: '20px', lineHeight: '1.6', whiteSpace: 'pre-wrap', fontSize: '16px', color: '#444' }}>
          <h4 style={{ marginBottom: '10px', fontWeight: 'bold' }}>책 소개</h4>
          {product.book_desc || '책 소개 정보가 없습니다.'}
        </div>
        <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
          <button onClick={handleAddCart} style={cartButtonStyle}>장바구니</button>
          <button onClick={handleBuyNow} style={buyButtonStyle}>바로구매</button>
        </div>
      </div>
    </div>
  );
}
