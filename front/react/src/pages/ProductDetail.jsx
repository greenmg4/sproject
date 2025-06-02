import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ProDetail, addCart } from '../service/apiService';

export default function ProductDetail() {
  const location = useLocation();
  const { prod_no } = useParams();
  const navigate = useNavigate();

  // location.state에 상품 데이터가 있으면 바로 세팅, 없으면 null
  const [product, setProduct] = useState(location.state || null);

    useEffect(() => {
    if (!product && prod_no) {
        console.log('ProDetail 호출, prod_no:', prod_no);
        ProDetail(prod_no)
        .then(data => {
            console.log('ProDetail 데이터:', data);
            setProduct(data);
        })
        .catch(err => {
            console.error('ProDetail 호출 실패:', err);
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
      alert('장바구니 추가에 실패했습니다.');
      console.error(error);
    }
  };

  if (!product) return <div>상품 정보를 불러오는 중입니다...</div>;

  return (
    <div className="contents">
      <p className="pageTitle">** 상품 상세 정보 **</p>
      <table className="listTable">
        <tbody>
          <tr><th>상품번호</th><td>{product.prod_no}</td></tr>
          <tr><th>상품명</th><td>{product.prod_nm}</td></tr>
          <tr><th>가격</th><td>{product.prod_price}</td></tr>
          <tr><th>상품 카테고리</th><td>{product.category}</td></tr>
          <tr><th>재고수</th><td>{product.prod_cnt}</td></tr>
          <tr><th>출판사</th><td>{product.publisher}</td></tr>
          <tr><th>저자</th><td>{product.author_nm}</td></tr>
        </tbody>
      </table>

      <button
        onClick={handleAddCart}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        🛒 장바구니 담기
      </button>
    </div>
  );
}