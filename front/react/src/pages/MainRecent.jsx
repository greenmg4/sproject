import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { apiCall } from '../service/apiService';
import { useNavigate } from 'react-router-dom';
import '../styles/MainRecent.css';


export default function MainRecent() {
    const navigate = useNavigate();
    const location = useLocation();

    // 최신상품리스트 정보
    const [recentResult, setRecentResult] = useState([]);

    useEffect(() => {
        getRecentProductList("/product/getRecentProductList");
    }, []);

    const getRecentProductList = (url) => {
        
        apiCall(url, 'GET', null, null)
        .then((response) => {
            if (!response || !Array.isArray(response)) {
                console.error("응답 데이터가 올바르지 않습니다:", response);
                setRecentResult([]);
                return;
            }

            if (response.length === 0) {
                setRecentResult([]);
            } else {
                const resultArray = [];

                response.forEach(item => {
            
                    // 2. 배열에 객체 추가
                    resultArray.push({
                        prod_no: item.prod_no,
                        prod_nm: item.prod_nm,
                        img_path: item.img_path,
                        prod_price : item.prod_price,
                        publisher : item.publisher,
                        author_nm : item.author_nm,
                    });
                    setRecentResult(resultArray);
                });
            
            }
        })
        .catch((err) => {
            if (err===502) { alert(`** 처리도중 오류 발생, err=${err}`);
            }else if (err===403) {
                  alert(`** Server Reject : 접근권한이 없습니다. => ${err}`); 
            }else alert(`** serverDataRequest 시스템 오류, err=${err}`);
        }); //apiCall
    };

    const handleClick = (product) => {
        navigate(`/product/${product.prod_no}`);
    };

    return (
        <div>
        <h2 className="recent-gradient-box">최 신 도 서</h2>
        <div className="recent-product-container">
            


                <div className="recent-product-grid"  >
                    {recentResult.map((item, i) => (
                        <div className="recent-product-card"
                            key={item.prod_no} 
                            onClick={() => handleClick(item)} 
                            style={{ cursor: "pointer" }}
                        >
                            <img
                                src={`/${item.img_path}`}
                                alt={item.prod_nm}
                                className="recent-product-image"
                            />
                            <div className="recent-product-info">
                                <h3 className="product-name">{item.prod_nm}</h3>
                                <p className="product-price">{item.prod_price.toLocaleString()}원</p>
                                <p className="product-meta">{item.publisher} | {item.author_nm}</p>
                            </div>

                        </div>
                    ))}
                </div>
            

        </div>
        </div>
    );
}