import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderPayment() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    product,
    cust_id,
    cnt,
    selectedCartItems,
    totalPrice,
    cust_nm: initialCustNm,
    email,
    phone: initialPhone,
  } = location.state || {};

  const inputStyle = {
    marginBottom: "12px",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
  };

  // 배송지 정보
  const [postcode, setPostcode] = useState("");
  const [address1, setAddress] = useState("");
  const [address2, setDetailAddress] = useState("");

  // 수령인 정보
  const [cust_nm, setCustNm] = useState(initialCustNm || "");
  const [phone, setPhone] = useState(initialPhone || "");

  // 약관 동의 체크박스
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreeProduct, setAgreeProduct] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const [discRate, setDiscRate] = useState(0); // 할인율 (%)
  const [discMaxAmt, setDiscMaxAmt] = useState(0); // 최대 할인액



  const isFormValid =
    postcode &&
    address1 &&
    address2 &&
    cust_nm &&
    phone &&
    agreeAll &&
    agreeAge &&
    agreeProduct &&
    agreePrivacy;

  const isCart = Array.isArray(selectedCartItems);
  const items = isCart ? selectedCartItems : product ? [{ ...product, cnt }] : [];
  const itemTotalPrice = isCart
    ? totalPrice
    : product
    ? product.prod_price * cnt
    : 0;
  

  useEffect(() => {
    const impScript = document.createElement("script");
    impScript.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
    impScript.onload = () => {
      if (window.IMP) window.IMP.init("imp06723305");
    };
    document.body.appendChild(impScript);

    const daumScript = document.createElement("script");
    daumScript.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    document.body.appendChild(daumScript);
  }, []);

  const openPostcodePopup = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setPostcode(data.zonecode);
        setAddress(data.address);
      },
    }).open();
  };

  const handleAgreeAllChange = (e) => {
    const checked = e.target.checked;
    setAgreeAll(checked);
    setAgreeAge(checked);
    setAgreeProduct(checked);
    setAgreePrivacy(checked);
  };

  const handlePayment = () => {
    if (!isFormValid) {
      alert("필수 정보를 모두 입력하고 약관에 동의해주세요.");
      return;
    }

    const IMP = window.IMP;
    if (!IMP) {
      alert("결제 모듈이 로딩되지 않았습니다.");
      return;
    }

    const merchant_uid = `order_${new Date().getTime()}`;
    const productName = isCart
      ? `${items[0].prod_nm} 외 ${items.length - 1}건`
      : items[0]?.prod_nm;

    IMP.request_pay(
      {
        pg: "kakaopay.TC0ONETIME",
        pay_method: "card",
        merchant_uid,
        name: productName,
        amount: finalAmount,
        buyer_email: email,
        buyer_name: cust_nm,
        buyer_tel: phone,
        buyer_addr: `${address1} ${address2}`,
        buyer_postcode: postcode,
      },
      async (rsp) => {
        if (rsp.success) {
          try {
            const response = await fetch("/api/order/save", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                cust_id,
                pay_method: rsp.pay_method === "card" ? "2" : "1",
                ord_dtm: new Date().toISOString(),
                tot_amount: finalAmount,
                prod_cnt: items.reduce((sum, item) => sum + item.cnt, 0),
                rcv_nm: cust_nm,
                rcv_phone: phone,
                address1,
                address2,
                zip: postcode,
                order_items: items.map((item) => ({
                  prod_no: item.prod_no,
                  buy_price: item.prod_price,
                  cnt: item.cnt,
                })),
              }),
            });

            if (!response.ok) throw new Error("주문 저장에 실패했습니다.");

            const data = await response.json();

            alert("결제가 완료되고 주문이 저장되었습니다.");
            navigate("/", {
              state: {
                payInfo: rsp,
                items,
                totalAmount: finalAmount,
                shippingAddr: `${address1} ${address2}`,
                orderId: data.orderId,
              },
            });
          } catch (error) {
            alert("결제는 되었으나 주문 저장에 실패했습니다: " + error.message);
          }
        } else {
          alert("결제에 실패하였습니다: " + rsp.error_msg);
        }
      }
    );
  };

  useEffect(() => {
    if (!cust_id || items.length === 0) {
      alert("잘못된 접근입니다.");
      navigate("/");
    }
  }, [cust_id, items, navigate]);

  useEffect(() => {
  if (!cust_id) return;

  const fetchDefaultAddress = async () => {
    try {
      const res = await fetch(`/api/address/default/${cust_id}`);
      if (!res.ok) throw new Error("기본 배송지를 불러올 수 없습니다.");
      const data = await res.json();

      setPostcode(data.postcode);
      setAddress(data.address1);
      setDetailAddress(data.address2);
    } catch (error) {
      console.error("기본 배송지 오류:", error);
    }
  };

  fetchDefaultAddress();
}, [cust_id]);
  

  const shippingFee = itemTotalPrice >= 30000 ? 0 : 2500;

  useEffect(() => {
  if (!cust_id) return;

  const fetchDiscountInfo = async () => {
    try {
      const res = await fetch(`/api/order/discount/${cust_id}`);
      if (!res.ok) throw new Error("할인 정보를 불러올 수 없습니다.");
      const data = await res.json();
      setDiscRate(data.disc_rate);
      setDiscMaxAmt(data.disc_max_amt);
    } catch (error) {
      console.error(error);
    }
  };

  fetchDiscountInfo();
}, [cust_id]);

const productDiscount = Math.min(
  Math.floor(itemTotalPrice * (discRate / 100)),
  discMaxAmt
);
const finalAmount = itemTotalPrice + shippingFee - productDiscount;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px", display: "flex", gap: "20px" }}>
      <div style={{ flex: 2 }}>
        {/* 배송지 정보 */}
        <section
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ fontSize: "18px", marginBottom: "15px", textAlign: "center" }}>배송지 정보</h3>

          <div style={{ width: "95%", maxWidth: "500px", margin: "0 auto" }}>
            <input
              type="text"
              placeholder="수령인 이름"
              value={cust_nm}
              onChange={(e) => setCustNm(e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="전화번호"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="우편번호"
                value={postcode}
                readOnly
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                onClick={openPostcodePopup}
                style={{
                  padding: "10px 16px",
                  fontSize: "14px",
                  backgroundColor: "#3498db",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                배송지 입력
              </button>
            </div>
            <input
              type="text"
              placeholder="주소"
              value={address1}
              readOnly
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="상세주소"
              value={address2}
              onChange={(e) => setDetailAddress(e.target.value)}
              style={inputStyle}
            />
          </div>
        </section>

        {/* 주문 상품 목록 */}
        <section style={{ border: "1px solid #e0e0e0", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "15px" }}>주문 상품</h3>
          {items.map((item) => (
            <div
              key={item.prod_no}
              style={{
                display: "flex",
                gap: "15px",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <img
                src={ `/${item.img_path}`}
                alt={item.prod_nm}
                style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "16px", marginBottom: "6px" }}>{item.prod_nm}</p>
                <p style={{ fontSize: "14px", color: "#555" }}>
                  가격: {item.prod_price.toLocaleString()}원 x {item.cnt}개
                </p>
              </div>
              <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                {(item.prod_price * item.cnt).toLocaleString()}원
              </p>
            </div>
          ))}
        </section>
      </div>

      {/* 우측 영역 */}
      <div style={{ flex: 1 }}>
        {/* 주문 요약 */}
        <div style={{ border: "1px solid #e0e0e0", borderRadius: "8px", padding: "20px", marginBottom: "20px", backgroundColor: "#fafafa" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "15px" }}>주문 요약</h3>
          <div style={{ fontSize: "14px", color: "#333" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span>상품 금액</span>
              <span>{itemTotalPrice.toLocaleString()}원</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span>배송비</span>
              <span>{shippingFee === 0 ? "무료" : `${shippingFee.toLocaleString()}원`}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span>할인 ({discRate}% {discMaxAmt ? `(최대 ${discMaxAmt.toLocaleString()}원)` : ""})</span>
              <span style={{ color: "#e74c3c" }}>-{productDiscount.toLocaleString()}원</span>
            </div>
            <hr style={{ margin: "10px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "bold" }}>
              <span>최종 결제 금액</span>
              <span>{finalAmount.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 약관 동의 */}
        <div style={{ border: "1px solid #e0e0e0", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>약관 동의</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input type="checkbox" checked={agreeAll} onChange={handleAgreeAllChange} />
              <span style={{ fontSize: "14px" }}>전체 동의</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input type="checkbox" checked={agreeAge} onChange={(e) => setAgreeAge(e.target.checked)} />
              <span style={{ fontSize: "14px" }}>만 14세 이상입니다. (필수)</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input type="checkbox" checked={agreeProduct} onChange={(e) => setAgreeProduct(e.target.checked)} />
              <span style={{ fontSize: "14px" }}>주문 상품 정보 동의 (필수)</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input type="checkbox" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} />
              <span style={{ fontSize: "14px" }}>개인 정보 수집 및 이용 동의 (필수)</span>
            </label>
          </div>
        </div>

        {/* 결제 버튼 */}
        <button
          onClick={handlePayment}
          disabled={!isFormValid}
          style={{
            width: "100%",
            padding: "15px 0",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: isFormValid ? "#3498db" : "#b0c7d9",
            border: "none",
            borderRadius: "8px",
            cursor: isFormValid ? "pointer" : "not-allowed",
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}