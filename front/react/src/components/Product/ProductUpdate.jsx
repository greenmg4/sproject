import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductUpdate = () => {
  const { prodNo } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [img_class, setImgClass] = useState("01");

  useEffect(() => {
    axios.get(`http://localhost:8080/product/detail?prodNo=${prodNo}`)
      .then((res) => setProduct(res.data))
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
    <div style={{ padding: "2rem" }}>
      <h2>✏️ 상품 수정</h2>

      {productImage && (
        <div>
          <img
            src={`http://localhost:8080${productImage.img_path}`}
            alt="상품 이미지"
            width={180}
            height={180}
          />
          <p>현재 이미지 클래스: {productImage.img_class}</p>
        </div>
      )}

      <input type="file" onChange={handleFileChange} accept="image/*" /><br />
      <select value={img_class} onChange={(e) => setImgClass(e.target.value)}>
        <option value="01">메인이미지</option>
        <option value="02">정면</option>
        <option value="03">상</option>
        <option value="04">하</option>
        <option value="05">좌</option>
        <option value="06">우</option>
      </select><br />

      <span>상품 이름: </span>
      <input name="prod_nm" value={product.prod_nm} onChange={handleChange} /><br />

      <span>상품 가격: </span>
      <input name="prod_price" value={product.prod_price} onChange={handleChange} /><br />

      <span>카테고리: </span>
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
      </select><br />

      <span>상품 상태: </span>
      <select name="status" value={product.status} onChange={handleChange}>
        <option value="1">판매중</option>
        <option value="2">판매종료</option>
      </select><br />

      <span>재고수: </span>
      <input name="prod_cnt" value={product.prod_cnt} onChange={handleChange} /><br />

      <span>출판사: </span>
      <input name="publisher" value={product.publisher} onChange={handleChange} /><br />

      <span>저자: </span>
      <input name="author_nm" value={product.author_nm} onChange={handleChange} /><br />

      <span>상품 설명: </span>
      <textarea name="book_desc" value={product.book_desc} onChange={handleChange} /><br />

      <button onClick={handleUpdate}>수정하기</button>
    </div>
  );
};

export default ProductUpdate;
