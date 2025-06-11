import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ProList } from '../service/apiService';
import './ProductList.css';

export default function ProductList() {
  const location = useLocation();
  const { category = 'A' } = location.state || {};
  const [list, setList] = useState(null);


  useEffect(() => {
    setList(null);
    
    const searchCond = {
      category: category,
      prod_nm: '',
      author_nm: '',
      prod_no: ''
    };

    ProList(searchCond)
      .then(data => {
        if (data.length > 0) setList(data);
        else {
          alert('출력할 상품이 없습니다 ~~');
          setList([]);
        }
      })
      .catch(err => {
        alert('상품 조회 중 오류가 발생했습니다.');
        setList([]);
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