import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ProList } from '../service/apiService';

export default function ProductList() {
  const location = useLocation();
  const { category = 'A' } = location.state || {};  // 기본값 'A'는 모든 상품

  const [list, setList] = useState(null);

  useEffect(() => {
    // category를 인자로 API 호출
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
    return (
      <div style={{ fontWeight: 'bold', fontSize: 30, height: 600 }}>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="contents">
        <p className="pageTitle">** ProductList **</p>
        <table className="listTable">
          <thead>
            <tr style={{ backgroundColor: 'AliceBlue', height: '20px' }}>
              <th>상품번호</th>
              <th>상품명</th>
              <th>상품가격</th>
              <th>상품 카테고리</th>
              <th>재고수</th>
              <th>출판사</th>
              <th>저자</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, i) => (
              <tr key={'productItem' + i}>
                <td>{item.prod_no}</td>
                <td>
                  <Link 
                    to={{
                      pathname: `/product/${item.prod_no}`,
                      state: item,  // 서버에서 받아온 상품 정보를 그대로 넘김
                    }}>{item.prod_nm}
                  </Link>
                </td>
                <td>{item.prod_price}</td>
                <td>{item.category}</td>
                <td>{item.prod_cnt}</td>
                <td>{item.publisher}</td>
                <td>{item.author_nm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}