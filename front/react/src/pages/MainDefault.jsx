import { useNavigate } from 'react-router-dom';
import { apiCall } from '../service/apiService';
import '../styles/Main.css';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { useEffect, useState } from "react";

function MainDefault() {
    const navigate = useNavigate();

    // const serverDataRequest = (url) => {
    //     // token 적용 이전
    //     //apiCall(url, 'GET', null, null)

    //     // token 적용 이후
    //     //alert(`** serverDataRequest 요청전 token 확인 =${token}`);
    //     apiCall(url, 'GET', null, null)
    //     .then((response) => {
    //         alert(`** serverDataRequest 성공 url=${url}`);
    //         sessionStorage.setItem("serverData", JSON.stringify(response));
    //         navigate(url);
    //     }).catch((err) => {
    //         if (err===502) { alert(`** 처리도중 오류 발생, err=${err}`);
    //         }else if (err===403) {
    //                 alert(`** Server Reject : 접근권한이 없습니다. => ${err}`); 
    //         }else alert(`** serverDataRequest 시스템 오류, err=${err}`);
    //     }); //apiCall
    // } //serverDataRequest


    // 추천상품리스트 정보
    const [suggestResult, setSuggestResult] = useState([]);

    const settings = {
        dots: true,
        infinite: suggestResult.length > 1,  // 요소가 하나면 무한 루프 비활성화
        speed: 1200,
        slidesToShow: suggestResult.length > 1 ? 2 : 1,  // 개수에 따라 동적 설정
        slidesToScroll: 1,
        autoplay: suggestResult.length > 1,  // 요소가 하나면 자동 슬라이드 비활성화
        autoplaySpeed: 4000,    
    };

    useEffect(() => {
        getSuggestProductList("/product/getSuggestProductList");
    }, []);

    const getSuggestProductList = (url) => {
        
        apiCall(url, 'GET', null, null)
        .then((response) => {
            if (!response || !Array.isArray(response)) {
                console.error("응답 데이터가 올바르지 않습니다:", response);
                setSuggestResult([]);
                return;
            }

            if (response.length === 0) {
                setSuggestResult([]);
            } else {
                const resultArray = [];

                response.forEach(item => {
            
                    // 2. 배열에 객체 추가
                    resultArray.push({
                        prod_no: item.prod_no,
                        prod_nm: item.prod_nm,
                        image: item.img_path,
                    });
                    setSuggestResult(resultArray);
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

    const handleDoublClick = (product) => {
        
        //let jsonData = { prod_no: `${product.prod_no}`, category: "A", category_nm: "", prod_nm: `${product.prod_nm}`, author_nm: "" };
        //let jsonData = { prod_no: `${product.prod_no}`, category: "", prod_nm: "", author_nm: "" };
        //alert(JSON.stringify(jsonData, null, 2));

        //navigate("/product/ProductDetail", { state: jsonData });
        navigate(`/product/${product.prod_no}`);
    };

    return (
        <div className='body_container'>
            <hr></hr>
            {/* <h3>~~ Main 영역 ~~</h3> */}
            <div id="contents">

            {suggestResult.length === 0 ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "630px" }}>
                    <img alt="MainImage" src="images/homeImages/library01.png" width={1200} height={600} />
                </div>

            ) : suggestResult.length === 1 ? (
                <div style={{ width: "80%", margin: "0 auto", paddingTop: "20px" }}>
                    <img src={suggestResult[0].image} 
                         alt={suggestResult[0].name} 
                        style={{ height: "500px", objectFit: "cover" }}
                        onDoubleClick={() => handleDoublClick(suggestResult[0])}
                    />
                    <h3>{suggestResult[0].name}</h3>
                </div>
            ) : (
                <div style={{ width: "80%", margin: "0 auto", paddingTop: "20px"}}>
                    <Slider {...settings}>
                        {suggestResult.map((product) => (
                            <div 
                                key={product.prod_no} 
                                onDoubleClick={() => handleDoublClick(product)} 
                                style={{ cursor: "pointer" }}
                            >
                                <div style={{ 
                                    display: "flex", 
                                    justifyContent: "center", /* 가로 중앙 */
                                    alignItems: "center", /* 세로 중앙 */
                                    height: "500px" /* 부모 요소 높이 지정 */
                                }}>
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        style={{ 
                                            //width: "100%", 
                                            //height: "auto", /* 비율 유지 */
                                            height: "450px", /* 모든 이미지의 높이를 동일하게 설정 */
                                            //objectFit: "contain" 
                                            objectFit: "cover" /* 이미지가 잘리지 않도록 조정 */
                                        }} 
                                    />
                                </div>
                                <h3>{product.name}</h3>
                            </div>

                        ))}
                    </Slider>
                </div>
            )}

            </div>
        </div>
    );  
}

export default MainDefault;
