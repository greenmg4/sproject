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
      .catch((err) => console.error("상품 이미지 조회 실패:", err));
  }, []);

  const productDelete = (prod_no) => {
    const confirmed = window.confirm("해당 상품을 삭제하시겠습니까?");
    if (!confirmed) return;

    axios.delete("http://localhost:8080/product/delete", { params: { prodNo: prod_no } })
      .then(() => {
        alert("삭제되었습니다.");
        window.location.reload();
      })
      .catch((err) => {
        alert("삭제에 실패했습니다.");
        console.error(err);
    });
};

  const getImageByProdNo = (prod_no) => {
    const image = productImages.find(img => img.prod_no === prod_no);
    return image ? `/${image.img_path}` : null;
  };


  const goToUpdateProductPage = (prod_no) => {
    navigate(`/product/update/${prod_no}`);
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

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1.5rem"
      }}>
        {products.map((p) => (
          <div key={p.prod_no} style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            {getImageByProdNo(p.prod_no) && (
              <img
                alt="productimage"
                src={getImageByProdNo(p.prod_no)}
                width={180}
                height={180}
                style={{ objectFit: "cover", marginBottom: "1rem" }}
              />
            )}
            <div style={{ marginBottom: "1rem" }}>
              <strong>{p.prod_nm}</strong><br />
              가격: {p.prod_price}원<br />
              저자: {p.author_nm}<br />
              카테고리: {getCategoryName(p.category)}<br />
              재고: {p.prod_cnt}<br />
              상태: {p.status === "1" ? "판매중" : "판매종료"}<br />
              출판사: {p.publisher}<br />
              등록일: {p.reg_dtm}<br />
              수정일: {p.upd_dtm || "없음"}<br />
              설명: {p.book_desc}
            </div>
            <button onClick={() => goToUpdateProductPage(p.prod_no)}>상품 수정</button>&nbsp;&nbsp;
            <button onClick={() => productDelete(p.prod_no)}>상품 삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
