import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductUpload = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    prod_nm: "",
    prod_price: 0,
    category: "01",
    status: "1",
    prod_cnt: 0,
    publisher: "",
    author_nm: "",
    book_desc: "",
    suggest_yn: "N" // 기본값 N
  });


  const [imageFile, setImageFile] = useState(null);
  const [img_class, setImgClass] = useState("01");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("이미지를 선택해주세요");

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("imgClass", img_class); // 백엔드에서는 @RequestParam("imgClass") 사용
    formData.append("product", JSON.stringify(product));

    try {
      await axios.post("http://localhost:8080/product/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("상품 등록 성공!");
      navigate("/product");
    } catch (err) {
      console.error(err);
      alert("상품 등록 실패");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>📦 상품 등록</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="prod_nm" placeholder="상품명" onChange={handleChange} required /><br />
        <input type="number" name="prod_price" placeholder="가격" onChange={handleChange} required /><br />

        <select name="category" onChange={handleChange}>
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

        <select name="status" onChange={handleChange}>
          <option value="1">판매중</option>
          <option value="2">판매종료</option>
        </select><br />

        <input type="number" name="prod_cnt" placeholder="재고수" onChange={handleChange} required /><br />
        <input type="text" name="publisher" placeholder="출판사" onChange={handleChange} /><br />
        <input type="text" name="author_nm" placeholder="저자" onChange={handleChange} /><br />

        <select name="suggest_yn" value={product.suggest_yn} onChange={handleChange}>
          <option value="N">일반도서</option>
          <option value="Y">추천도서</option>
        </select><br />

        <textarea name="book_desc" placeholder="책 설명" rows="5" onChange={handleChange} /><br />

        <input type="file" onChange={handleFileChange} accept="image/*" /><br />
        <select value={img_class} onChange={(e) => setImgClass(e.target.value)}>
          <option value="01">메인이미지</option>
          <option value="02">정면</option>
          <option value="03">상</option>
          <option value="04">하</option>
          <option value="05">좌</option>
          <option value="06">우</option>
        </select><br />

        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default ProductUpload;
