import '../styles/Main.css';
import React, { useState, useEffect } from 'react';
import { getStorageData } from '../service/apiService';
import { Link } from 'react-router-dom';

export default function ProductList(){
    const [list, setList] = useState(null); 
    // => 출력할 Data list 정의
    
    useEffect(() => { 
        if ( getStorageData() !== null )  setList(getStorageData());
        else alert (' 출력할 내용이 없습니다 ~~ '); }, []);
      // => 서버에서 가져와 sessionStorage에 담아놓은 Data(MemberList) 를
      //    getStorageData() 함수로 꺼내어 list 에 담기. 
    
      // => 데이터를 받아올 때까지 로딩 표시
      if (list === null) {
          return (
              <div style={{ fontWeight: 'bold', fontSize: 30, height: 600 }}>
                  Loading...
              </div>
          );
      }else 
          return (
              <div>
                <div className="contents">  
                  <p className="pageTitle">** ProductList **</p>
                  <table className="listTable">
                    <thead>
                      <tr style={{backgroundColor:'AliceBlue', height:'20px'}}>
                        <th>상품번호</th><th>상품명</th><th>상품가격</th><th>상품 카테고리</th>
                        <th>재고수</th><th>출판사</th><th>저자</th>
                      </tr>
                    </thead>  
                    <tbody>
                      {list.map((item, i) => (
                          <tr key={'memberitem' + i}>
                            <td>{item.prod_no}</td><td><Link to={`/product/${item.prod_no}`}>{item.prod_nm}</Link></td>
                            <td>{item.prod_price}</td><td>{item.category}</td>
                            <td>{item.prod_cnt}</td><td>{item.publisher}</td><td>{item.author_nm}</td>
                          </tr>
                          )) }
                    </tbody>
                  </table>
                </div>  
              </div>
          ); //return
}