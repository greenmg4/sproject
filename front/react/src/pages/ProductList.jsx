import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ProList } from '../service/apiService';
import './ProductList.css';

export default function ProductList() {
  const location = useLocation();
  const { category = 'A' } = location.state || {};
  const [list, setList] = useState(null);

  useEffect(() => {
    ProList(category)
      .then(data => {
        if (data.length > 0) setList(data);
        else {
          alert('출력할 상품이 없습니다 ~~');
          setList([]);
        }
      })
      .catch(err => {
        console.error('상품 목록 조회 실패', err);
        alert('서버에서 상품 목록을 불러오지 못했습니다.');
      });
  }, [category]);

  if (list === null) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="product-container">
      <h2 className="product-title">상품 목록</h2>
      <div className="product-grid">
        {list.map((item, i) => (
          <div className="product-card" key={i}>
            <Link to={{
              pathname: `/product/${item.prod_no}`,
              state: item,
            }}>
              <img
                src={item.img_path || '/images/recommendation/default-product.png'}
                alt={item.prod_nm}
                className="product-image"
              />
              <div className="product-info">
                <h3 className="product-name">{item.prod_nm}</h3>
                <p className="product-price">{item.prod_price.toLocaleString()}원</p>
                <p className="product-meta">{item.publisher} | {item.author_nm}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}