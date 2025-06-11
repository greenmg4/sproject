import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductUpdate.css";

const ProductUpdate = () => {
  const { prodNo } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [img_class, setImgClass] = useState("01");

  useEffect(() => {
    axios.get(`http://localhost:8080/product/detail?prodNo=${prodNo}`)
    .then((res) => {
    const data = res.data;

    // ✅ suggest_yn이 null 또는 undefined면 기본값 "N"으로 세팅
    if (data.suggest_yn === null || data.suggest_yn === undefined) {
      data.suggest_yn = "N";
    }

    setProduct(data);
  })
      .catch((err) => console.error("상품 상세 조회 실패", err));

    axios.get(`http://localhost:8080/product/productimage/one?prodNo=${prodNo}`)
      .then((res) => {
        setProductImage(res.data);
        setImgClass(res.data.img_class);
      })
      .catch((err) => console.error("이미지 조회 실패", err));
  }, [prodNo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewImageFile(e.target.files[0]);
  };

  const handleUpdate = async () => {
    try {
      // 상품 정보 업데이트
      await axios.put("http://localhost:8080/product/update", product);

      // 이미지 새로 업로드 시
      if (newImageFile) {
        const formData = new FormData();
        formData.append("image", newImageFile);
        formData.append("prodNo", prodNo);
        formData.append("imgClass", img_class);

        await axios.post("http://localhost:8080/product/productimage/update", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert("수정 완료");
      navigate("/product");
    } catch (err) {
      console.error("수정 실패", err);
    }
  };

  if (!product) return <div>로딩 중...</div>;

  return (
    <div className="product-update-container">
      <h2>✏️ 상품 수정</h2>

      {productImage && (
        <div className="form-group">
          <label>현재 이미지</label>
          <img
            src={`/${productImage.img_path}`}
            alt="상품 이미지"
            width={180}
            height={180}
          />
          <p>현재 이미지 클래스: {productImage.img_class}</p>
        </div>
      )}

      <div className="form-group">
        <label>새 이미지 업로드</label>
        <input type="file" onChange={handleFileChange} accept="image/*" />
      </div>

      <div className="form-group">
        <label>이미지 구분</label>
        <select value={img_class} onChange={(e) => setImgClass(e.target.value)}>
          <option value="01">메인이미지</option>
          <option value="02">정면</option>
          <option value="03">상</option>
          <option value="04">하</option>
          <option value="05">좌</option>
          <option value="06">우</option>
        </select>
      </div>

      <div className="form-group">
        <label>상품 이름</label>
        <input name="prod_nm" value={product.prod_nm} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>상품 가격</label>
        <input name="prod_price" type="number" value={product.prod_price} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>카테고리</label>
        <select name="category" value={product.category} onChange={handleChange}>
          <option value="01">소설</option>
          <option value="02">에세이</option>
          <option value="03">인문</option>
          <option value="04">요리</option>
          <option value="05">건강</option>
          <option value="06">정치</option>
          <option value="07">종교</option>
          <option value="08">과학</option>
          <option value="09">외국어</option>
          <option value="10">IT</option>
        </select>
      </div>

      <div className="form-group">
        <label>상품 상태</label>
        <select name="status" value={product.status} onChange={handleChange}>
          <option value="1">판매중</option>
          <option value="2">판매종료</option>
        </select>
      </div>

      <div className="form-group">
        <label>재고수</label>
        <input name="prod_cnt" type="number" value={product.prod_cnt} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>출판사</label>
        <input name="publisher" value={product.publisher} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>저자</label>
        <input name="author_nm" value={product.author_nm} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>추천 여부</label>
        <select name="suggest_yn" value={product.suggest_yn} onChange={handleChange}>
          <option value="N">일반도서</option>
          <option value="Y">추천도서</option>
        </select>
      </div>

      <div className="form-group">
        <label>상품 설명</label>
        <textarea name="book_desc" value={product.book_desc} onChange={handleChange} />
      </div>

      <button onClick={handleUpdate}>수정하기</button>
    </div>
  );
};

export default ProductUpdate;
