import { addCart } from '../service/apiService'; // 추가
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { getStorageData } from '../service/apiService';

export default function ProductDetail() {
    const { prod_no } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const allProducts = getStorageData();
        const foundProduct = allProducts.find(p => String(p.prod_no) === prod_no);
        setProduct(foundProduct);
    }, [prod_no]);

    const handleAddCart = async () => {
        try {
            await addCart(product); // DB 저장
            alert('장바구니에 상품이 추가되었습니다.');
            navigate('/cart'); // 장바구니 페이지로 이동
        } catch (error) {
            alert('장바구니 추가에 실패했습니다.');
        }
    };

    if (!product) {
        return <div>상품 정보를 찾을 수 없습니다.</div>;
    }

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
                🛒 장바구니로 이동
            </button>
        </div>
    );
}