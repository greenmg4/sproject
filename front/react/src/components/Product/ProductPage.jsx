import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState([]);
	const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/product/page")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("상품 조회 실패:", err));

    axios.get("http://localhost:8080/product/productimage")
      .then((res) => setProductImages(res.data))
      .catch((err) => console.error("상품이미지 조회 실패:", err));
  }, []);

	const productDelete = (prodNo) => {
		axios.delete(`http://localhost:8080/product/delete` ,{params: { prodNo: prodNo }})
		.then((res) => {
			alert("삭제완료"); 
			window.location.reload();
		})
		.catch((err) => {
			alert("삭제실패", err);
		});
	}

  const getImageByProdNo = (prodNo) => {
    const image = productImages.find(img => img.prodno === prodNo);
    return image ? `http://localhost:8080${image.imgpath}` : null;
  };

  const goToUpdateProductPage = (prodNo) => {
		navigate(`/product/update/${prodNo}`);
  };

	const getCategoryName = (code) => {
  	const categories = {
    "01": "소설",
    "02": "에세이",
    "03": "인문",
    "04": "요리",
    "05": "건강",
    "06": "정치",
    "07": "종교",
    "08": "과학",
    "09": "외국어",
    "10": "IT"
  	};
  	return categories[code] || "기타";
	};

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "auto" }}>
      <h2>📚 상품 목록</h2>

      {/* 그리드 레이아웃 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1.5rem"
      }}>
        {products.map((p) => (
          <div key={p.prodNo} style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            {getImageByProdNo(p.prodNo) && (
              <img
                alt="productimage"
                src={getImageByProdNo(p.prodNo)}
                width={180}
                height={180}
                style={{ objectFit: "cover", marginBottom: "1rem" }}
              />
            )}
            <div style={{ marginBottom: "1rem" }}>
              <strong>{p.prodNm}</strong><br />
              가격: {p.prodPrice}원<br />
              저자: {p.authorNm}<br />
              카테고리: {getCategoryName(p.category)}<br />
              재고: {p.prodCnt}<br />
              상태: {p.status === "1" ? "판매중" : "판매종료"}<br />
              출판사: {p.publisher}<br />
              등록일: {p.regDtm}<br />
              수정일: {p.updDtm || "없음"}<br />
              설명: {p.bookDesc}
            </div>
            <button onClick={() => goToUpdateProductPage(p.prodNo)}>상품수정</button>&nbsp;&nbsp;
						<button onClick={() => productDelete(p.prodNo)}>상품삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
