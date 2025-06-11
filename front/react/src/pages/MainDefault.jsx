import { useNavigate } from 'react-router-dom';
import { apiCall } from '../service/apiService';
import '../styles/Main.css';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { useEffect, useState, useRef } from "react";

function MainDefault() {
    const navigate = useNavigate();

    const serverDataRequest = (url) => {
        // token 적용 이전
        //apiCall(url, 'GET', null, null)

        // token 적용 이후
        //alert(`** serverDataRequest 요청전 token 확인 =${token}`);
        apiCall(url, 'GET', null, null)
        .then((response) => {
            alert(`** serverDataRequest 성공 url=${url}`);
            sessionStorage.setItem("serverData", JSON.stringify(response));
            navigate(url);
        }).catch((err) => {
            if (err===502) { alert(`** 처리도중 오류 발생, err=${err}`);
            }else if (err===403) {
                    alert(`** Server Reject : 접근권한이 없습니다. => ${err}`); 
            }else alert(`** serverDataRequest 시스템 오류, err=${err}`);
        }); //apiCall
    } //serverDataRequest

    const settings = {
        dots: true,  // 네비게이션 점 표시
        infinite: true,  // 무한 루프 설정
        speed: 1200,  // 애니메이션 속도
        slidesToShow: 2,  // 한 번에 보여줄 슬라이드 개수
        slidesToScroll: 1,  // 한 번에 스크롤될 개수
        autoplay: true,  // 자동 슬라이드
        autoplaySpeed: 5000, // 자동 슬라이드 속도 (5초)
    };


    // 추천상품리스트 정보
    const [suggestResult, setSuggestResult] = useState([]);

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
        let jsonData = { prod_no: `${product.prod_no}`, category: "", prod_nm: "", author_nm: "" };
        //alert(JSON.stringify(jsonData, null, 2));

        navigate("/product/ProList", { state: jsonData });
    };

    return (
        <div className='body_container'>
            <hr></hr>
            {/* <h3>~~ Main 영역 ~~</h3> */}
            <div id="contents">

            { ( suggestResult.length === 0) ? 
                (
                <img alt="MainImage" src="images/homeImages/library01.png" width={800} height={400} /> 

                ) :
                (
                    <div style={  { width: "80%", margin: "0 auto", paddingTop: "20px" }}>
                        <Slider {...settings}>
                        {suggestResult.map((product) => (
                            <div key={product.prod_no} onDoubleClick={() => handleDoublClick(product)} style={{ cursor: "pointer" }} >
                            <img src={product.image} alt={product.name} style={{height: "500px", objectFit: "cover" }} />
                            <h3>{product.name}</h3>
                            </div>
                        ))}
                        </Slider>
                    </div>
                )
            }   
            </div>
        </div>
    );  
}

export default MainDefault;
